"use client"

import { useState } from "react"
import DynamicForm, { type Schema, type Field } from "@/components/dynamic-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Example schema with various field types and nested sections
const exampleSchema: Schema = {
  fields: [
    {
      id: "personalInfo",
      type: "section",
      label: "Personal Information",
      fields: [
        {
          id: "fullName",
          type: "text",
          label: "Full Name",
          placeholder: "Enter your full name",
          required: true,
        },
        {
          id: "email",
          type: "email",
          label: "Email Address",
          placeholder: "your.email@example.com",
          required: true,
          validation: "email",
        },
        {
          id: "phone",
          type: "text",
          label: "Phone Number",
          placeholder: "(123) 456-7890",
        },
      ],
    },
    {
      id: "preferences",
      type: "section",
      label: "Preferences",
      fields: [
        {
          id: "role",
          type: "select",
          label: "Preferred Role",
          options: [
            { value: "frontend", label: "Frontend Developer" },
            { value: "backend", label: "Backend Developer" },
            { value: "fullstack", label: "Full Stack Developer" },
            { value: "devops", label: "DevOps Engineer" },
          ],
          required: true,
        },
        {
          id: "notifications",
          type: "checkbox",
          label: "Receive email notifications",
        },
      ],
    },
    {
      id: "education",
      type: "section",
      label: "Education",
      fields: [
        {
          id: "degree",
          type: "text",
          label: "Degree",
          placeholder: "e.g., Bachelor of Science in Computer Science",
        },
        {
          id: "university",
          type: "text",
          label: "University",
          placeholder: "e.g., Stanford University",
        },
        {
          id: "graduationYear",
          type: "select",
          label: "Graduation Year",
          options: [
            { value: "2025", label: "2025" },
            { value: "2024", label: "2024" },
            { value: "2023", label: "2023" },
            { value: "2022", label: "2022" },
            { value: "2021", label: "2021" },
            { value: "other", label: "Other" },
          ],
        },
      ],
    },
    {
      id: "workExperience",
      type: "section",
      label: "Work Experience",
      fields: [
        {
          id: "company",
          type: "text",
          label: "Company",
          placeholder: "e.g., Google",
        },
        {
          id: "position",
          type: "text",
          label: "Position",
          placeholder: "e.g., Software Engineer",
        },
        {
          id: "duration",
          type: "text",
          label: "Duration",
          placeholder: "e.g., 2 years",
        },
        {
          id: "responsibilities",
          type: "textarea",
          label: "Responsibilities",
          placeholder: "Describe your key responsibilities",
        },
      ],
    },
    {
      id: "additionalInfo",
      type: "textarea",
      label: "Additional Information",
      placeholder: "Any other information you'd like to share",
    },
  ] as Field[],
}

// Custom schema for testing
const customSchema: Schema = {
  fields: [
    {
      id: "name",
      type: "text",
      label: "Form Name",
      placeholder: "Enter form name",
      required: true,
    },
    {
      id: "fields",
      type: "section",
      label: "Form Fields",
      fields: [
        {
          id: "field1",
          type: "text",
          label: "Field 1 Label",
          placeholder: "Enter field label",
        },
        {
          id: "field1Type",
          type: "select",
          label: "Field 1 Type",
          options: [
            { value: "text", label: "Text" },
            { value: "email", label: "Email" },
            { value: "number", label: "Number" },
            { value: "checkbox", label: "Checkbox" },
            { value: "select", label: "Select" },
          ],
        },
      ],
    },
  ] as Field[],
}

export default function Home() {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [activeSchema, setActiveSchema] = useState("example")

  const handleSubmit = (data: Record<string, any>) => {
    setFormData(data)
    setSubmitted(true)
  }

  const resetForm = () => {
    setFormData({})
    setSubmitted(false)
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Dynamic Form Builder</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Tabs defaultValue="example" onValueChange={setActiveSchema}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="example">Example Form</TabsTrigger>
              <TabsTrigger value="custom">Custom Form</TabsTrigger>
            </TabsList>
            <TabsContent value="example">
              <Card>
                <CardHeader>
                  <CardTitle>Example Form</CardTitle>
                  <CardDescription>A complex form with nested sections and various field types</CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicForm schema={exampleSchema} onSubmit={handleSubmit} resetOnSubmit={false} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Form</CardTitle>
                  <CardDescription>A simpler form structure for testing</CardDescription>
                </CardHeader>
                <CardContent>
                  <DynamicForm schema={customSchema} onSubmit={handleSubmit} resetOnSubmit={false} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Form Data</CardTitle>
              <CardDescription>
                {submitted
                  ? "Form has been submitted. Here's the captured data:"
                  : "Submit the form to see the data here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <>
                  <pre className="bg-slate-100 p-4 rounded-md overflow-auto max-h-[500px]">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                  <Button onClick={resetForm} className="mt-4">
                    Reset
                  </Button>
                </>
              ) : (
                <div className="text-center p-8 text-slate-500">No data submitted yet</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}