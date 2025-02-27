require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

let users = [];
const verificationCodes = new Map();
let requests = [];

// ✉ Email жіберу конфигурациясы
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Email арқылы растау кодын жіберу
app.post("/send-email", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email енгізіңіз!" });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, verificationCode);

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Растау коды",
        text: `Сіздің растау кодыңыз: ${verificationCode}`
    }, (error) => {
        if (error) return res.status(500).json({ message: "Қате орын алды!" });
        res.json({ message: "Растау коды жіберілді!" });
    });
});

// ✅ Қолданушы тіркеу
app.post("/register", async (req, res) => {
    const { username, email, phone, password, verificationCode } = req.body;
    if (!username || !email || !phone || !password || !verificationCode)
        return res.status(400).json({ message: "Барлық ақпаратты толтырыңыз!" });

    if (verificationCodes.get(email) !== verificationCode)
        return res.status(400).json({ message: "Растау коды дұрыс емес!" });

    if (users.find(user => user.email === email))
        return res.status(400).json({ message: "Бұл email тіркелген!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, email, phone, password: hashedPassword });
    verificationCodes.delete(email);

    res.json({ message: "Тіркелу сәтті аяқталды!" });
});

// ✅ Қолданушы логині
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    if (!user || !await bcrypt.compare(password, user.password))
        return res.status(401).json({ message: "Қате email немесе құпиясөз!" });

    res.status(200).json({ message: "Кіру сәтті өтті!" });
});

// ✅ Өтінішті қабылдау
app.post("/submit-request", (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
        return res.status(400).json({ message: "Барлық ақпаратты толтырыңыз!" });

    let newRequest = {
        id: Date.now().toString(),
        name,
        email,
        message,
        status: "Қабылданды"
    };

    requests.push(newRequest);
    res.json({ message: "Өтініш қабылданды!", request: newRequest });
});

// ✅ Барлық өтініштерді алу
app.get("/get-requests", (req, res) => {
    res.json(requests);
});

// ✅ Өтініш статусын жаңарту
app.post("/update-status", (req, res) => {
    const { id, status } = req.body;
    let request = requests.find(r => r.id === id);

    if (!request) return res.status(404).json({ message: "Өтініш табылмады!" });

    request.status = status;
    res.json({ message: "Статус жаңартылды!", request });
});

// ✅ Email арқылы өтінішке жауап беру
app.post("/send-response", (req, res) => {
    const { email, message } = req.body;
    if (!email || !message)
        return res.status(400).json({ message: "Email мен хабарлама қажет!" });

    transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Сіздің өтінішіңіз туралы жауап",
        text: message
    }, (error) => {
        if (error) return res.status(500).json({ message: "Хабарлама жіберу сәтсіз аяқталды." });
        res.json({ message: "Хабарлама жіберілді!" });
    });
});

// ✅ Серверді іске қосу
app.listen(port, () => console.log(`🚀 Сервер ${port} портында іске қосылды...`));
