import type { ModuleDetail } from "./types";

/* Module pages: kids-town — their catalogue group is the `group` field below. */
export const clubsModules: ModuleDetail[] = [
  {
    id: "kids-town",
    group: "activities",
    related: ["family", "ministries", "rooms", "telegram-bot"],
    copy: {
      ua: {
        seoTitle: "Дитяче служіння — реєстрація дітей і безпека | Моя Церква",
        seoDescription: "Дитяче служіння в «Моїй Церкві»: реєстрація дитини під батьками, відмітка приходу за секунди, групи за віком, алергії на бейджі й безпечна видача за кодом.",
        title: "Кожна дитина — у своїй групі й у безпеці",
        lead: "«Дитяче містечко» — окремий простір для дитячого служіння. Реєстрація дитини під батьками, відмітка приходу за секунди, групи за віком і код, за яким дитину віддають лише тим, хто має право.",
        highlights: [
          "Відмітка приходу і видача за кодом для батьків",
          "Групи за віком і кімнати з лімітом дітей",
          "Алергії та особливі потреби — на бейджі",
          "Графік, заміни та явка вчителів",
        ],
        features: [
          { icon: "ScanLine", title: "Відмітка приходу за секунди", text: "За QR, іменем чи телефоном батьків. Дитина отримує бейдж, батьки — код, за яким її віддадуть." },
          { icon: "ShieldCheck", title: "Безпечна видача", text: "Дитину віддають лише людині з кодом або зі списку довірених — учитель бачить фото й ім'я." },
          { icon: "Baby", title: "Групи за віком", text: "0–3, 4–6, 7–10, 11–13 — дитина потрапляє у свою групу автоматично, а система підказує, коли час переходити." },
          { icon: "AlertTriangle", title: "Алергії та потреби", text: "Горіхи, лактоза, особливості поведінки — учитель бачить це на бейджі й у списку групи." },
          { icon: "DoorOpen", title: "Кімнати й ліміти", text: "Кожна група — своя кімната й максимум дітей на вчителя. Переповнена — система попередить ще на вході." },
          { icon: "HeartHandshake", title: "Команда вчителів", text: "Графік служіння, підтвердження, заміни й явка вчителів — як у будь-якому іншому служінні." },
        ],
        steps: [
          { title: "Налаштуйте групи", text: "Вікові межі, кімнати, скільки дітей на одного вчителя. «Дитяче містечко» покаже, хто цієї неділі переходить у старшу групу." },
          { title: "Зареєструйте дітей", text: "Батьки заповнюють анкету через QR або бот один раз: вік, алергії, хто може забирати. Далі — лише відмітка приходу." },
          { title: "Запустіть відмітку приходу", text: "Планшет на вході або телефон служителя. Бейдж дитині, код батькам, дитина — у списку групи." },
          { title: "Дивіться явку й ріст", text: "Скільки дітей було, в яких групах тісно, хто з новеньких повернувся — у звітах дитячого служіння." },
        ],
        audience: [
          { role: "leader", text: "Керівник дитячого служіння бачить усі групи, вчителів, явку й кому в неділю потрібна заміна." },
          { role: "volunteer", text: "Учитель бачить список своєї групи, алергії й кому можна віддати дитину." },
          { role: "reception", text: "Відмічає прихід за іменем батьків, друкує бейдж і видає код." },
          { role: "member", text: "Батьки реєструють дитину один раз, бачать її групу й отримують повідомлення, якщо вона потребує їх." },
        ],
        faq: [
          { q: "Що, як дитину прийшов забрати хтось інший?", a: "Учитель бачить список довірених людей і код. Немає коду й людини в списку — система не дає завершити check-out, а батькам приходить сповіщення." },
          { q: "Чи потрібен планшет на вході?", a: "Ні. Відмітка приходу працює з будь-якого телефону служителя або з планшета. Бейджі друкуються на звичайному етикетковому принтері, якщо він у вас є." },
          { q: "Як зв'язатися з батьками під час служіння?", a: "Одна кнопка в списку групи — батькам приходить повідомлення в Telegram чи SMS із номером кімнати." },
          { q: "Чи бачать дані дітей усі служителі?", a: "Ні. Учитель бачить лише свою групу цієї неділі. Медичні примітки — тільки керівник дитячого служіння та вчитель групи." },
        ],
        mock: {
          kind: "form",
          title: "Відмітка приходу · Дитяче містечко",
          subtitle: "Нд, 21 квітня · 64 дитини в залах",
          fields: [
            { label: "Дитина", value: "Марко Ковальчук · 9 років", type: "select" },
            { label: "Група", value: "7–10 · Кімната 3 · 18 з 20", type: "select" },
            { label: "Привела", value: "Олена Ковальчук · мама", type: "text" },
            { label: "Алергії", value: "Горіхи", type: "text" },
            { label: "Код для батьків", value: "48-21", type: "text" },
            { label: "Надіслати код у Telegram", value: "Так", type: "check" },
          ],
          submit: "Відмітити і надрукувати бейдж",
        },
        pipeline: {
          title: "Шлях дитини: від входу до рук батьків",
          text: "Одна неділя очима «Дитячого містечка». Зліва — що роблять батьки й учителі, справа — що система робить сама.",
          stages: [
            { title: "Реєстрація", tone: "neutral", text: "Батьки один раз заповнюють анкету через QR або бот: вік, алергії, хто може забирати дитину.", auto: "Створює картку дитини під батьками й визначає вікову групу та кімнату." },
            { title: "Відмітка приходу", tone: "brand", text: "На вході — QR, ім'я або телефон батьків. Дитині бейдж, батькам код для видачі.", auto: "Перевіряє ліміт кімнати й попереджає ще на вході, якщо в групі немає місця." },
            { title: "На занятті", tone: "violet", text: "Учитель відкриває список своєї групи: імена, алергії та особливі потреби на бейджах.", auto: "Записує явку дитини й надсилає батькам повідомлення з номером кімнати, коли вчитель їх кличе." },
            { title: "Видача", tone: "amber", text: "Батьки показують код. Учитель звіряє його зі списком довірених людей і віддає дитину.", auto: "Без коду й без людини в списку не дає завершити check-out і сповіщає батьків." },
            { title: "Після служіння", tone: "green", text: "Керівник бачить явку по групах, тісні кімнати й новеньких, які прийшли вдруге.", auto: "Підказує, кому наступної неділі час переходити у старшу групу." },
          ],
        },
      },
      en: {
        seoTitle: "Kids Town — My Church module",
        seoDescription: "Children's ministry in My Church: a child registered under their parents, check-in in seconds, age groups, allergies on the badge and safe pick-up by code.",
        title: "Every child in the right group, and safe",
        lead: "Kids Town is a dedicated space for children's ministry. A child is registered under their parents, checked in within seconds, placed in an age group and handed back only to someone with the code.",
        highlights: [
          "Check-in and check-out with a parent code",
          "Age groups and rooms with a child limit",
          "Allergies and special needs on the badge",
          "Teacher rota, cover and attendance",
        ],
        features: [
          { icon: "ScanLine", title: "Check-in in seconds", text: "By QR, name or the parents' phone number. The child gets a badge, the parents get a code for pick-up." },
          { icon: "ShieldCheck", title: "Safe pick-up", text: "A child is handed back only to someone with the code or on the trusted list — the teacher sees a photo and name." },
          { icon: "Baby", title: "Age groups", text: "0–3, 4–6, 7–10, 11–13 — a child lands in the right group automatically, and the system flags when it's time to move up." },
          { icon: "AlertTriangle", title: "Allergies and needs", text: "Nuts, lactose, behavioural notes — the teacher sees it on the badge and in the group list." },
          { icon: "DoorOpen", title: "Rooms and limits", text: "Each group has its own room and a maximum of children per teacher. If it's full, the system warns at the door." },
          { icon: "HeartHandshake", title: "Teacher team", text: "Rota, confirmations, cover and teacher attendance — just like any other ministry." },
        ],
        steps: [
          { title: "Set up the groups", text: "Age ranges, rooms, how many children per teacher. Kids Town shows who moves up to the next group this Sunday." },
          { title: "Register the children", text: "Parents fill in a form once via QR or the bot: age, allergies, who may collect. After that it's check-in only." },
          { title: "Start checking in", text: "A tablet at the door or a volunteer's phone. Badge for the child, code for the parents, child on the group list." },
          { title: "Watch attendance and growth", text: "How many children came, which groups are crowded, which newcomers came back — in children's ministry reports." },
        ],
        audience: [
          { role: "leader", text: "The children's ministry lead sees every group, the teachers, attendance and who needs cover on Sunday." },
          { role: "volunteer", text: "A teacher sees their group list, allergies and who is allowed to collect each child." },
          { role: "reception", text: "Checks a child in by the parents' name, prints the badge and hands over the code." },
          { role: "member", text: "Parents register a child once, see their group and get a message if the child needs them." },
        ],
        faq: [
          { q: "What if someone else comes to collect the child?", a: "The teacher sees the trusted list and the code. No code and not on the list — the system won't complete check-out, and the parents get a notification." },
          { q: "Do we need a tablet at the door?", a: "No. Check-in works from any volunteer's phone or a tablet. Badges print on an ordinary label printer if you have one." },
          { q: "How do we reach parents during the service?", a: "One button in the group list — the parents get a Telegram or SMS message with the room number." },
          { q: "Can every volunteer see children's data?", a: "No. A teacher sees only their own group for this Sunday. Medical notes are visible to the children's ministry lead and the group's teacher only." },
        ],
        mock: {
          kind: "form",
          title: "Check-in · Kids Town",
          subtitle: "Sun 21 April · 64 children in rooms",
          fields: [
            { label: "Child", value: "Marko Kovalchuk · 9 y.o.", type: "select" },
            { label: "Group", value: "7–10 · Room 3 · 18 of 20", type: "select" },
            { label: "Brought by", value: "Olena Kovalchuk · mother", type: "text" },
            { label: "Allergies", value: "Nuts", type: "text" },
            { label: "Parent code", value: "48-21", type: "text" },
            { label: "Send the code via Telegram", value: "Yes", type: "check" },
          ],
          submit: "Check in and print badge",
        },
        pipeline: {
          title: "A child's path: from the door to their parents' hands",
          text: "One Sunday as Kids Town sees it. On the left, what parents and teachers do; on the right, what the system does by itself.",
          stages: [
            { title: "Registration", tone: "neutral", text: "Parents fill in a form once via QR or the bot: age, allergies, who may collect the child.", auto: "Creates the child's profile under the parents and works out the age group and room." },
            { title: "Check-in", tone: "brand", text: "At the door: a QR code, a name or the parents' phone. A badge for the child, a code for the parents.", auto: "Checks the room limit and warns at the door if the group has no places left." },
            { title: "In the room", tone: "violet", text: "The teacher opens their group list: names, allergies and special needs printed on the badges.", auto: "Records the child's attendance and messages the parents with the room number when the teacher calls them." },
            { title: "Pick-up", tone: "amber", text: "Parents show the code. The teacher checks it against the trusted list and hands the child over.", auto: "Without a code and without a name on the list it blocks check-out and notifies the parents." },
            { title: "After the service", tone: "green", text: "The lead sees attendance by group, crowded rooms and newcomers who came back a second time.", auto: "Flags who is due to move up to the next age group the following Sunday." },
          ],
        },
      },
    },
  },
];
