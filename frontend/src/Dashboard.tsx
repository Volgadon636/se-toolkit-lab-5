import { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Регистрируем компоненты Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

interface ScoreData {
    bucket: string;
    count: number;
}

interface TimelineData {
    date: string;
    count: number;
}

interface PassRateData {
    task_id: string;
    task_name: string;
    pass_rate: number;
}

const Dashboard = () => {
    const [labId, setLabId] = useState('lab-04');
    const [scoreData, setScoreData] = useState<ScoreData[]>([]);
    const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
    const [passRateData, setPassRateData] = useState<PassRateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Получаем токен из localStorage
    const token = localStorage.getItem('api_key');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                // Заголовки с токеном
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Загружаем все данные параллельно
                const [scoresRes, timelineRes, passRatesRes] = await Promise.all([
                    fetch(`/analytics/scores?lab=${labId}`, { headers }),
                    fetch(`/analytics/timeline?lab=${labId}`, { headers }),
                    fetch(`/analytics/pass-rates?lab=${labId}`, { headers })
                ]);

                if (!scoresRes.ok || !timelineRes.ok || !passRatesRes.ok) {
                    throw new Error('Ошибка загрузки данных');
                }

                const scores = await scoresRes.json();
                const timeline = await timelineRes.json();
                const passRates = await passRatesRes.json();

                setScoreData(scores);
                setTimelineData(timeline);
                setPassRateData(passRates);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ошибка загрузки');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        } else {
            setError('Нет API ключа. Войдите в систему.');
            setLoading(false);
        }
    }, [labId, token]);

    // Данные для графика распределения баллов
    const barChartData = {
        labels: scoreData.map(item => item.bucket),
        datasets: [
            {
                label: 'Количество студентов',
                data: scoreData.map(item => item.count),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }
        ]
    };

    // Данные для графика submissions over time
    const lineChartData = {
        labels: timelineData.map(item => item.date),
        datasets: [
            {
                label: 'Сабмиты по дням',
                data: timelineData.map(item => item.count),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.1
            }
        ]
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Распределение баллов'
            }
        }
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Сабмиты по дням'
            }
        }
    };

    if (loading) {
        return <div style={{ padding: '20px' }}>Загрузка...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Дашборд аналитики</h1>

            {/* Выбор лабораторной */}
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="lab-select">Выберите лабораторную: </label>
                <select
                    id="lab-select"
                    value={labId}
                    onChange={(e) => setLabId(e.target.value)}
                    style={{ padding: '5px', marginLeft: '10px' }}
                >
                    <option value="lab-01">Lab 01</option>
                    <option value="lab-02">Lab 02</option>
                    <option value="lab-03">Lab 03</option>
                    <option value="lab-04">Lab 04</option>
                    <option value="lab-05">Lab 05</option>
                </select>
            </div>

            {/* Графики */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <div style={{
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '5px',
                    backgroundColor: 'white'
                }}>
                    {scoreData.length > 0 ? (
                        <Bar data={barChartData} options={barOptions} />
                    ) : (
                        <p>Нет данных для распределения баллов</p>
                    )}
                </div>

                <div style={{
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '5px',
                    backgroundColor: 'white'
                }}>
                    {timelineData.length > 0 ? (
                        <Line data={lineChartData} options={lineOptions} />
                    ) : (
                        <p>Нет данных для timeline</p>
                    )}
                </div>
            </div>

            {/* Таблица с pass rates */}
            <div style={{
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '5px',
                backgroundColor: 'white'
            }}>
                <h2>Pass rates по заданиям</h2>
                {passRateData.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                                    Задание
                                </th>
                                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>
                                    Pass Rate (%)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {passRateData.map((item) => (
                                <tr key={item.task_id}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {item.task_name}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {Math.round(item.pass_rate * 100)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Нет данных о pass rates</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;