import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


const renderEventContent = (eventInfo) => {
  
    

  return (
    <div className="flex flex-col bg-gradient-to-r from-[#18CB96] to-[#A3AED0] text-white rounded-lg p-4 shadow-md">
      <div className="text-sm font-semibold">{eventInfo.timeText}</div>
      <div className="text-lg font-bold">{eventInfo.event.title}</div>
      <div className="text-lg font-bold">{eventInfo.event.quantity}</div>
      <div className="text-xs">{eventInfo.event.extendedProps.ref}</div>
    </div>
  );
};

function Calendar({events}) {
  const [calendarView, setCalendarView] = useState("timeGridDay"); 
  const [calendarRef, setCalendarRef] = useState(null);

  const handleViewChange = (e) => {
    const selectedView = e.target.value;
    setCalendarView(selectedView);
    if (calendarRef) {
      calendarRef.getApi().changeView(selectedView);
    }
  };
  
      
  

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-center">
        <select
          onChange={handleViewChange}
          value={calendarView}
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
        >
          <option value="dayGridMonth">Mois</option>
          <option value="timeGridWeek">Semaine</option>
          <option value="timeGridDay">Jour</option>
        </select>
      </div>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={calendarView}
        initialDate={new Date()}
        events={events}
        ref={(el) => setCalendarRef(el)}
        aspectRatio={1.5}
        headerToolbar={true}
        eventBackgroundColor="white"
        eventBorderColor="white"
        
        allDaySlot={false} // Supprime la section "all-day"
       
        slotMinTime="08:00:00" // Heure de début visible
        slotMaxTime="18:00:00" // Heure de fin visible
        eventContent={renderEventContent}
      />
    </div>
  );
}

export default Calendar;
