document.addEventListener("DOMContentLoaded", function () {
	// 🔹 Fanlar va o'qituvchilar ro'yxati
	const subjects = {
		Dasturlash: [{ id: "teacher1", name: "Sultan" }],
		"Ingliz tili": [{ id: "teacher2", name: "Seven" }],
	};

	const teachers = {
		teacher1: 587788509, // Sultan
		teacher2: 5732165828, // Seven
	};

	// 🔹 HTML elementlarini olish
	const subjectSelect = document.getElementById("subject");
	const teacherSelect = document.getElementById("teacher");

	// 🔹 Fanlar select'ini dinamik yaratish
	subjectSelect.innerHTML = '<option value="">Fan tanlang</option>';
	Object.keys(subjects).forEach((subject) => {
		const option = document.createElement("option");
		option.value = subject;
		option.textContent = subject;
		subjectSelect.appendChild(option);
	});

	// 🔹 Fan tanlanganda o'qituvchilarni filter qilish
	subjectSelect.addEventListener("change", function () {
		const selectedSubject = subjectSelect.value;
		teacherSelect.innerHTML = '<option value="">O‘qituvchini tanlang</option>';

		if (subjects[selectedSubject]) {
			subjects[selectedSubject].forEach((teacher) => {
				const option = document.createElement("option");
				option.value = teacher.id;
				option.textContent = teacher.name;
				teacherSelect.appendChild(option);
			});
		} else {
			alert("Bu fandan dars beradigan o'qituvchi yo'q!");
		}
	});

	// 🔹 Formni jo'natish
	document.getElementById("smsForm").addEventListener("submit", function (event) {
		event.preventDefault();

		const botToken = "7822484855:AAGH184pXq1-8MyzmPwPl1FO1GA6ooJybRE";
		const name = document.getElementById("name").value.trim();
		const surname = document.getElementById("surname").value.trim();
		const phone = document.getElementById("phone").value.trim();
		const subject = subjectSelect.value;
		const teacherKey = teacherSelect.value;

		if (!teacherKey || !teachers[teacherKey]) {
			alert("Iltimos, o'qituvchini to'g'ri tanlang!");
			return;
		}

		const teacherId = teachers[teacherKey];
		const message = `📩 *Yangi xabar!*\n👤 *Ism:* ${name}\n👤 *Familya:* ${surname}\n📞 *Telefon:* ${phone}\n📚 *Fan:* ${subject}`;

		const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
		const data = {
			chat_id: teacherId,
			text: message,
			parse_mode: "Markdown",
		};

		fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.ok) {
					alert("✅ Xabar o'qituvchiga muvaffaqiyatli yuborildi!");
					document.getElementById("smsForm").reset();
				} else {
					alert("❌ Xatolik yuz berdi! Bot token va ID ni tekshiring.");
					console.error("Telegram API xatosi: ", data);
				}
			})
			.catch((error) => console.error("❌ Xatolik: ", error));
	});
});
