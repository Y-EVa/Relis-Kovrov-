const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Разрешаем серверу отдавать все файлы из папки проекта (картинки, CSS и т.д.)
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// НАСТРОЙКА ОТПРАВКИ ПОЧТЫ (замените на свои данные)
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',        // Для mail.ru
    port: 465,                   // Для SSL
    secure: true,                // true для порта 465
    auth: {
        user: 'RedLunx@mail.ru', // Ваш email
        pass: 'AtFJl34H243WLDSUaKT3'       // Пароль от почты (НЕ пароль от mail.ru, а специальный)
    }
});

app.post('/submit-form', async (req, res) => {
    const { name, phone } = req.body;
    
    console.log('=================================');
    console.log('📩 НОВАЯ ЗАЯВКА!');
    console.log(`👤 Имя: ${name}`);
    console.log(`📞 Телефон: ${phone}`);
    console.log(`🕐 Время: ${new Date().toLocaleString()}`);
    console.log('=================================');
    
    // Отправляем письмо
    try {
        const info = await transporter.sendMail({
            from: '"Сайт" <RedLunx@mail.ru>',    // От кого
            to: 'RedLunx@mail.ru',               // Кому (можно несколько через запятую)
            subject: '🟢 Новая заявка с сайта!',  // Тема письма
            text: `Новая заявка с вашего сайта!\n\nИмя: ${name}\nТелефон: ${phone}\nВремя: ${new Date().toLocaleString()}`,
            html: `
                <h2>🟢 Новая заявка!</h2>
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Телефон:</strong> ${phone}</p>
                <p><strong>Время:</strong> ${new Date().toLocaleString()}</p>
                <hr/>
                <p>Сообщение сгенерировано автоматически.</p>
            `
        });
        
        console.log(`✉️ Письмо отправлено: ${info.messageId}`);
        
        res.json({ 
            success: true, 
            message: `Спасибо, ${name}! Мы свяжемся с вами. Письмо отправлено на почту.` 
        });
        
    } catch (error) {
        console.error('❌ Ошибка отправки письма:', error);
        res.json({ 
            success: true,  // Всё равно говорим, что заявка принята
            message: `Спасибо, ${name}! Заявка принята, но письмо не отправилось. Мы всё равно свяжемся.` 
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log(`Ожидаю заявки...`);
});