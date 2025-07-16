import ical from 'ical-generator';

export async function GET({ request }) {
    const calendar = ical({ name: 'Mi Calendario' });

    calendar.createEvent({
        start: new Date('2025-07-20T10:00:00'),
        end: new Date('2025-07-20T11:00:00'),
        summary: 'Demo: Reunión de proyecto',
        description: 'Reunión para revisar avances y próximos pasos.',
        location: 'Ciudad de México',
    });

    return new Response(calendar.toString(), {
        headers: {
            'Content-Type': 'text/calendar;charset=utf-8',
            'Content-Disposition': 'attachment; filename="evento.ics"',
        },
    });
}