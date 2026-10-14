import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useI18n } from '../../contexts/I18nContext';

export function CareDaysChart({ data }: {data: {month: string;days: number;}[];}) {
  const { date, daysLabel, dir } = useI18n();
  const formatted = data.map((d) => ({ ...d, label: date(`${d.month}-01`, { month: 'short' }) }));
  return (
    <div className="h-56 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatted} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#E5ECE9" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#5F706E', fontSize: 12 }} reversed={dir === 'rtl'} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#5F706E', fontSize: 12 }} orientation={dir === 'rtl' ? 'right' : 'left'} />
          <Tooltip
            cursor={{ fill: 'rgba(221,245,236,0.6)' }}
            formatter={(value) => [daysLabel(Number(value)), '']}
            separator=""
            contentStyle={{ borderRadius: 12, border: '1px solid #E5ECE9', boxShadow: '0 10px 30px -14px rgba(23,43,42,0.25)', fontSize: 13 }} />
          
          <Bar dataKey="days" fill="#0F766E" radius={[8, 8, 2, 2]} maxBarSize={44} />
        </BarChart>
      </ResponsiveContainer>
    </div>);

}