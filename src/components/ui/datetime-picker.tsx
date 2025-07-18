
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { ptBR } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DateTimePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DateTimePicker({ 
  value, 
  onChange, 
  placeholder = "Selecione data e hora",
  disabled = false 
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [timeValue, setTimeValue] = React.useState(
    value ? format(value, "HH:mm") : "00:00"
  )

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && onChange) {
      // Preservar a hora atual ou usar a hora do timeValue
      const [hours, minutes] = timeValue.split(':')
      const newDateTime = new Date(selectedDate)
      newDateTime.setHours(parseInt(hours, 10))
      newDateTime.setMinutes(parseInt(minutes, 10))
      newDateTime.setSeconds(0)
      newDateTime.setMilliseconds(0)
      
      onChange(newDateTime)
    }
  }

  const handleTimeChange = (time: string) => {
    setTimeValue(time)
    if (value && onChange) {
      const [hours, minutes] = time.split(':')
      const newDateTime = new Date(value)
      newDateTime.setHours(parseInt(hours, 10))
      newDateTime.setMinutes(parseInt(minutes, 10))
      newDateTime.setSeconds(0)
      newDateTime.setMilliseconds(0)
      
      onChange(newDateTime)
    }
  }

  const handleNow = () => {
    const now = new Date()
    setTimeValue(format(now, "HH:mm"))
    if (onChange) {
      onChange(now)
    }
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(value, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            initialFocus
            className="pointer-events-auto"
          />
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Horário</span>
            </div>
            <Input
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleNow}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Agora
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              size="sm"
              className="flex-1"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
