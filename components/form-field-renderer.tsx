"use client"

import { useRef } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Card, CardContent } from "@/components/ui/card"
import { GripVertical } from "lucide-react"

type Field = {
  id: string
  type: string
  label: string
  [key: string]: any
}

type FormFieldRendererProps = {
  fields: Field[]
  onChange: (fields: Field[]) => void
}

type DragItem = {
  index: number
  type: string
}

const DraggableField = ({
  field,
  index,
  moveField,
}: {
  field: Field
  index: number
  moveField: (dragIndex: number, hoverIndex: number) => void
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "FIELD",
    item: { index } as DragItem,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop<DragItem, void, unknown>({
    accept: "FIELD",
    hover: (item, monitor) => {
      if (!ref.current) return
      if (item.index === index) return

      moveField(item.index, index)
      item.index = index
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="mb-2 cursor-move"
    >
      <Card>
        <CardContent className="p-4 flex items-center">
          <div className="mr-2">
            <GripVertical size={20} />
          </div>
          <div className="flex-1">
            <div className="font-medium">{field.label}</div>
            <div className="text-sm text-gray-500">{field.type}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function FormFieldRenderer({ fields, onChange }: FormFieldRendererProps) {
  const moveField = (dragIndex: number, hoverIndex: number) => {
    const newFields = [...fields]
    const [removed] = newFields.splice(dragIndex, 1)
    newFields.splice(hoverIndex, 0, removed)
    onChange(newFields)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <DraggableField
            key={field.id}
            field={field}
            index={index}
            moveField={moveField}
          />
        ))}
      </div>
    </DndProvider>
  )
}