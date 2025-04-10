"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define types for our schema
export type FieldOption = {
  value: string
  label: string
}

export type BaseField = {
  id: string
  label: string
  required?: boolean
  validation?: string
}

export type TextField = BaseField & {
  type: "text" | "email" | "number"
  placeholder?: string
}

export type TextareaField = BaseField & {
  type: "textarea"
  placeholder?: string
}

export type SelectField = BaseField & {
  type: "select"
  options: FieldOption[]
}

export type CheckboxField = BaseField & {
  type: "checkbox"
}

export type SectionField = BaseField & {
  type: "section"
  fields: Field[]
}

export type Field = TextField | TextareaField | SelectField | CheckboxField | SectionField

export type Schema = {
  fields: Field[]
}

type DynamicFormProps = {
  schema: Schema
  onSubmit: (data: Record<string, any>) => void
  resetOnSubmit?: boolean
}

export default function DynamicForm({ schema, onSubmit, resetOnSubmit = true }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Initialize form data with default values
  useEffect(() => {
    const initialData: Record<string, any> = {}

    const initializeFields = (fields: Field[], parentKey = "") => {
      fields.forEach((field) => {
        const fieldKey = parentKey ? `${parentKey}.${field.id}` : field.id

        if (field.type === "section") {
          initializeFields(field.fields, fieldKey)
        } else if (field.type === "checkbox") {
          initialData[fieldKey] = false
        } else if (field.type === "select" && field.options.length > 0) {
          initialData[fieldKey] = ""
        } else {
          initialData[fieldKey] = ""
        }
      })
    }

    initializeFields(schema.fields)
    setFormData(initialData)
  }, [schema])

  const validateField = (field: Field, value: any): string => {
    if (field.required && (value === "" || value === undefined || value === null)) {
      return `${field.label} is required`
    }

    if (field.validation === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address"
      }
    }

    return ""
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    const validateFields = (fields: Field[], parentKey = "") => {
      fields.forEach((field) => {
        const fieldKey = parentKey ? `${parentKey}.${field.id}` : field.id

        if (field.type === "section") {
          validateFields(field.fields, fieldKey)
        } else {
          const error = validateField(field, formData[fieldKey])
          if (error) {
            newErrors[fieldKey] = error
            isValid = false
          }
        }
      })
    }

    validateFields(schema.fields)
    setErrors(newErrors)
    return isValid
  }

  const handleChange = (id: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error when field is changed
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Process nested data structure
      const processedData = processFormData(formData)
      onSubmit(processedData)

      if (resetOnSubmit) {
        // Reset form after submission if needed
        const initialData: Record<string, any> = {}
        setFormData(initialData)
      }
    }
  }

  // Process dot notation keys into nested objects
  const processFormData = (data: Record<string, any>): Record<string, any> => {
    const result: Record<string, any> = {}

    Object.entries(data).forEach(([key, value]) => {
      if (key.includes(".")) {
        const keys = key.split(".")
        let current = result

        keys.forEach((k, i) => {
          if (i === keys.length - 1) {
            current[k] = value
          } else {
            current[k] = current[k] || {}
            current = current[k]
          }
        })
      } else {
        result[key] = value
      }
    })

    return result
  }

  // Recursive function to render fields
  const renderField = (field: Field, parentKey = ""): React.JSX.Element => {
    const fieldKey = parentKey ? `${parentKey}.${field.id}` : field.id
    const error = errors[fieldKey]

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div className="mb-4" key={fieldKey}>
            <Label htmlFor={fieldKey} className="mb-2 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldKey}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[fieldKey] || ""}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        )

      case "textarea":
        return (
          <div className="mb-4" key={fieldKey}>
            <Label htmlFor={fieldKey} className="mb-2 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={fieldKey}
              placeholder={field.placeholder}
              value={formData[fieldKey] || ""}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        )

      case "select":
        return (
          <div className="mb-4" key={fieldKey}>
            <Label htmlFor={fieldKey} className="mb-2 block">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select value={formData[fieldKey] || ""} onValueChange={(value) => handleChange(fieldKey, value)}>
              <SelectTrigger id={fieldKey} className={error ? "border-red-500" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div className="mb-4 flex items-start space-x-2" key={fieldKey}>
            <Checkbox
              id={fieldKey}
              checked={formData[fieldKey] || false}
              onCheckedChange={(checked) => handleChange(fieldKey, checked)}
            />
            <Label
              htmlFor={fieldKey}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {field.label}
            </Label>
          </div>
        )

      case "section":
        return (
          <Card key={fieldKey} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{field.label}</CardTitle>
            </CardHeader>
            <CardContent>{field.fields.map((nestedField) => renderField(nestedField, fieldKey))}</CardContent>
          </Card>
        )

      default:
        const _exhaustiveCheck: never = field
        return <div key={fieldKey}>Unsupported field type</div>
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please fix the errors in the form before submitting.</AlertDescription>
        </Alert>
      )}

      {schema.fields.map((field) => renderField(field))}

      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  )
}