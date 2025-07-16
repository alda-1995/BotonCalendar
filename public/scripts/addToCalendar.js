const event = {
  title: 'Demo: Reunión de proyecto',
  description: 'Reunión para revisar avances y próximos pasos.',
  location: 'Ciudad de México',
  start: new Date('2025-07-20T10:00:00'),
  end: new Date('2025-07-20T11:00:00'),
};

const pad = (n) => (n < 10 ? '0' + n : '' + n);
const toYYYYMMDDTHHMMSSZ = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

const ua = navigator.userAgent || navigator.vendor || window.opera;
const isAndroid = /android/i.test(ua);
const isiOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

const enrichedEvent = {
  ...event,
  startStr: toYYYYMMDDTHHMMSSZ(new Date(event.start)),
  endStr: toYYYYMMDDTHHMMSSZ(new Date(event.end)),
  ics: (() => {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//astro-add-to-calendar//v1.0//ES',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@astro.demo`,
      `DTSTAMP:${toYYYYMMDDTHHMMSSZ(new Date())}`,
      `DTSTART:${toYYYYMMDDTHHMMSSZ(new Date(event.start))}`,
      `DTEND:${toYYYYMMDDTHHMMSSZ(new Date(event.end))}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  })(),
};

function downloadICS(evt) {
  const blob = new Blob([evt.ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'evento.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadICSFromServer() {
  const a = document.createElement('a');
  a.href = '/api/ics'; // O el path que definiste
  a.download = 'evento.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function buildGoogleCalendarURL(evt) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: evt.title,
    dates: `${evt.startStr}/${evt.endStr}`,
    details: evt.description,
    location: evt.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

document.getElementById('add-to-calendar')?.addEventListener('click', () => {
  if (isAndroid) {
    window.open(buildGoogleCalendarURL(enrichedEvent), '_blank');
  } else if (isiOS) {
    // downloadICS(enrichedEvent);
    downloadICSFromServer();
  } else {
    const choice = confirm('Abrir Google Calendar (Aceptar) o descargar .ics (Cancelar)?');
    if (choice) {
      window.open(buildGoogleCalendarURL(enrichedEvent), '_blank');
    } else {
      // downloadICS(enrichedEvent);
      downloadICSFromServer();
    }
  }
});