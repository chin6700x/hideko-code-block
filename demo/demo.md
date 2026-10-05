# แผนการสร้างหน้า Demo ทดสอบการทำงานของ Hideko (Built `dist/`)

โฟลเดอร์ `demo/` จะประกอบด้วยหน้า HTML หลายไฟล์ แต่ละไฟล์ทดสอบการใช้งาน `dist/` ในรูปแบบที่แตกต่างกัน เพื่อยืนยันว่า Build Artifacts ทำงานได้ถูกต้องครบถ้วนก่อนนำไปเผยแพร่สาธารณะ

---

## 📂 โครงสร้างโฟลเดอร์ Demo

```
demo/
├── 00-file-viewer.html         # Interactive File Viewer เต็มจอ (w-full, h-full, ปุ่มลอย, ปรับค่าได้อิสระ)
├── 01-basic-iife.html          # ทดสอบโหลดแบบ <script> ธรรมดา (IIFE)
├── 02-esm-module.html          # ทดสอบโหลดแบบ ES Module (<script type="module">)
├── 03-all-themes.html          # ทดสอบแสดงผลทั้ง 7 ธีมเปรียบเทียบกัน
├── 04-multi-languages.html     # ทดสอบโหลดหลายภาษาพร้อมกัน (JS, Python, SQL, CSS, HTML, JSON)
├── 05-auto-scanner.html        # ทดสอบ highlightAll() สแกน <pre><code> อัตโนมัติ
├── 06-manual-highlight.html    # ทดสอบ highlight() API เรียกทีละ element ด้วยมือ
├── 07-dynamic-inject.html      # ทดสอบฉีดโค้ดแบบ Dynamic (เพิ่มบล็อกโค้ดทีหลังแล้วสั่งไฮไลต์)
├── 08-copy-button.html         # ทดสอบปุ่ม Copy Code ว่าทำงานถูกต้อง
├── 09-lazy-scroll.html         # ทดสอบ Lazy Load ตาม Viewport
├── 10-virtual-scroll.html      # ทดสอบ Virtual Buffer & Adaptive Scrolling (50,000+ บรรทัด)
├── 11-line-numbers.html        # ทดสอบ Line Numbers & Line Highlighting
└── index.html                  # หน้ารวมลิงก์ไปแต่ละ Demo
```

---

## 📋 รายละเอียดแต่ละ Demo

### Demo 00: Interactive File Viewer (`00-file-viewer.html`)
**เป้าหมาย:** แอปพลิเคชันเปิดไฟล์โค้ดจริงจากเครื่องคอมพิวเตอร์เพื่อแสดงผลแบบเต็มจอ (Full Viewport `w-full`, `h-full`) และปรับแต่งตั้งค่า Hideko ได้แบบ Real-time
- **Layout:** รองรับ `w-full` และ `h-full` แสดงโค้ดแบบเต็มหน้าต่าง ไร้ขอบล้น พร้อม Scrollbar สวยงาม
- **ปุ่มเปิดไฟล์แบบลอย (Floating FAB):** ปุ่มเปิดไฟล์ gradient ลอยเด่นตรงมุมขวาล่าง กดเพื่อเปิด File Picker จากเครื่อง หรือกดปุ่มคีย์ลัด `Ctrl+O` / `Cmd+O`
- **Drag & Drop:** สามารถลากไฟล์โค้ดจากคอมพิวเตอร์มาวางบนหน้าต่างเบราว์เซอร์ได้ทันที มี Dropzone Overlay แสดงผล
- **ระบบตรวจจับภาษาอัตโนมัติ:** ตรวจจากนามสกุลไฟล์ เช่น `.py` → Python, `.ts`/`.tsx` → TypeScript, `.sql` → SQL
- **Floating Settings Panel (แถบตั้งค่าแบบลอย):**
  - สลับ 7 ธีมได้ทันที (`dark`, `light`, `dracula`, `one-dark`, `nord`, `monokai`, `github-dark`)
  - เปลี่ยนภาษาที่ต้องการไฮไลต์ได้เอง
  - สวิตช์เปิด/ปิด เลขบรรทัด (Line Numbers)
  - ช่องระบุช่วงบรรทัดที่ต้องการไฮไลต์แถบสี (Highlight Lines เช่น `3, 7-10`)
  - กำหนดเลขบรรทัดเริ่มต้น (Start Line Offset)
  - ตัวเลือกสลับ Virtual Scroll (Auto / Always Virtual / Normal Mode)
  - ปรับขนาดตัวอักษร (Font Size Slider 11px - 24px)
  - เปิด/ปิด ตัดคำขึ้นบรรทัดใหม่ (Word Wrap)
  - ปุ่มโหลดไฟล์ตัวอย่างทันที: React Component, Python ML Pipeline, Complex SQL, หรือไฟล์ทดสอบ 2,500 บรรทัด
- **Telemetry Bar:** แสดงชื่อไฟล์, ขนาดไฟล์, จำนวนบรรทัด, ความเร็วในการ Render (ms), และโหมดที่ใช้งาน

---

### Demo 01: Basic IIFE / UMD (`01-basic-iife.html`)
**เป้าหมาย:** ทดสอบว่า `dist/hideko-code-block.umd.js` (Browser UMD/IIFE) ทำงานได้จริงเมื่อโหลดแบบแท็ก `<script>` ธรรมดา
- โหลด `dist/hideko-code-block.umd.js` + `dist/style.min.css`
- โหลดภาษา `dist/languages/javascript.js`
- ใช้ `HidekoCodeBlock.highlightAll()` สแกน `<pre><code>` ในหน้า
- **ตรวจ:** token classes (`.mtk5`, `.mtk7`, `.mtk11`) ปรากฏใน DOM ถูกต้อง, สีตรงตามธีม

---

### Demo 02: ESM Module (`02-esm-module.html`)
**เป้าหมาย:** ทดสอบว่า `dist/hideko-code-block.js` (ESM) ทำงานได้จริงเมื่อโหลดแบบ `<script type="module">`
- ใช้ `import { highlight, highlightAll } from '../dist/hideko-code-block.js'`
- โหลดภาษาแบบ dynamic import: `await import('../dist/languages/python.js')`
- **ตรวจ:** เปรียบเทียบว่า output ESM กับ output UMD (Demo 01) ได้ผลเหมือนกัน

---

### Demo 03: All Themes Showcase (`03-all-themes.html`)
**เป้าหมาย:** แสดงโค้ดเดียวกันในทุกธีม 7 ธีมเปรียบเทียบกัน บนหน้าเดียว
- ธีมที่ทดสอบ: `dark`, `light`, `dracula`, `one-dark`, `nord`, `monokai`, `github-dark`
- ใช้โค้ด JavaScript ตัวอย่างเดียวกัน วางซ้อนกัน 7 บล็อก แต่ละบล็อกตั้ง `data-theme` ต่างกัน
- **ตรวจ:** CSS Variables (`--hideko-bg`, `--hideko-fg`, `--mtk5` ฯลฯ) แต่ละธีมมีสีแตกต่างกัน, พื้นหลังและตัวอักษรเปลี่ยนตามธีมถูกต้อง

---

### Demo 04: Multi Languages (`04-multi-languages.html`)
**เป้าหมาย:** ทดสอบการโหลดและไฮไลต์หลายภาษาพร้อมกัน
- ภาษาที่ทดสอบ: JavaScript, Python, SQL, CSS, HTML, JSON, Rust, Go
- ตรวจ: แต่ละบล็อกภาษาแสดง Token สีที่ถูกต้องตามไวยากรณ์ภาษานั้น ๆ
  - Python: keyword `def`, `return` เป็นสีน้ำเงิน (`.mtk5`), string เป็นสีส้ม (`.mtk7`)
  - SQL: keyword `SELECT`, `FROM` เป็นสีน้ำเงิน, ตัวเลขเป็นสีเขียว (`.mtk6`)
  - CSS: property เป็นสีหนึ่ง, value เป็นอีกสีหนึ่ง
- **ตรวจ:** ทุกภาษาแยกสีได้ถูกต้อง ไม่มีภาษาใดแสดงเป็น plain text (ไม่มีสี)

---

### Demo 05: Auto Scanner (`05-auto-scanner.html`)
**เป้าหมาย:** ทดสอบ `highlightAll()` สแกน DOM อัตโนมัติรองรับทุกรูปแบบที่ระบุไว้ใน Scanner
- รูปแบบที่ต้องทดสอบ:
  1. `<pre><code class="language-javascript">...</code></pre>` (รูปแบบมาตรฐาน)
  2. `<pre class="language-python">...</pre>` (class บน pre โดยตรง)
  3. `<div data-lang="sql">...</div>` (ใช้ `data-lang` attribute)
  4. `<div h-lang="css">...</div>` (ใช้ `h-lang` attribute แบบ Hideko เอง)
  5. `<pre><code class="lang-go">...</code></pre>` (class ใช้ prefix `lang-` แทน `language-`)
  6. `<div class="hideko" data-lang="json">...</div>` (ใช้ class `.hideko`)
- **ตรวจ:** ทุก element ที่กล่าวมาถูกสแกนและแปลงเป็นโค้ดมีสีทั้งหมด ไม่ตกหล่น

---

### Demo 06: Manual Highlight API (`06-manual-highlight.html`)
**เป้าหมาย:** ทดสอบเรียก `highlight()` API ตรงๆ เพื่อแปลงสตริงโค้ดเป็น HTML แล้วยัดเข้า DOM ด้วยมือ
- เรียก `HidekoHighlight.highlight(codeString, langDef, conf, ['root'])`
- นำ `result.html` ไปใส่ใน `<pre>` ที่เตรียมไว้
- **ตรวจ:** สามารถควบคุม output ด้วย API ระดับต่ำได้ถูกต้อง ไม่ต้องพึ่ง Scanner

---

### Demo 07: Dynamic Inject (`07-dynamic-inject.html`)
**เป้าหมาย:** ทดสอบ scenario จริงที่โค้ดถูกเพิ่มเข้ามาใน DOM ทีหลัง (เช่น Single Page App, AJAX, Chat App)
- กดปุ่ม → JavaScript สร้าง `<pre><code>...</code></pre>` ใหม่ → เรียก `HidekoHighlight.highlightElement(newElement)` บนตัวใหม่
- กดปุ่มซ้ำหลายครั้ง → ตรวจว่าไม่ประมวลผลซ้ำ (เพราะมี `data-hideko-processed="true"`)
- **ตรวจ:** โค้ดที่ถูกฉีดเข้ามาทีหลังก็ไฮไลต์ได้ถูกต้อง, ไม่มี double-processing

---

### Demo 08: Copy Button (`08-copy-button.html`)
**เป้าหมาย:** ทดสอบปุ่ม Copy ที่แทรกเข้ามาอัตโนมัติ
- ตรวจว่าทุก `<pre>` block มีปุ่ม Copy ปรากฏ (ตัวจัดสร้างจาก `utils.js → createCopyButton()`)
- กดปุ่ม Copy → ข้อความโค้ดต้นฉบับ (ไม่มี HTML tags) ถูกคัดลอกเข้า Clipboard สำเร็จ
- หลังกดปุ่มแสดงข้อความ feedback (เช่น "Copied!" หรือเปลี่ยนไอคอน)
- **ตรวจ:** วาง (Paste) ที่อื่นได้โค้ดต้นฉบับที่ถูกต้องครบถ้วน

---

### Demo 09: Viewport Lazy Loading (`09-lazy-scroll.html`)
**เป้าหมาย:** ทดสอบการทำ Viewport Lazy Loading ผ่าน IntersectionObserver ด้วยตัวเลือก `{ lazy: true }`
- บล็อกโค้ดที่อยู่บนสุด (ใน viewport) ถูกไฮไลต์ทันที
- บล็อกโค้ดที่อยู่ด้านล่าง (นอก viewport) ยังไม่ถูกไฮไลต์ และยังไม่ดึงไฟล์ภาษา
- เมื่อผู้ใช้ Scroll ลงมาใกล้ถึง บล็อกโค้ดจะถูกไฮไลต์และโหลดภาษาแบบ On-Demand อัตโนมัติ
- มี Telemetry HUD แสดงสถานะแบบเรียลไทม์

---

### Demo 10: Virtual Buffer & Adaptive Scrolling (`10-virtual-scroll.html`)
**เป้าหมาย:** ทดสอบระบบ Virtual Buffer และ Adaptive Smart Threshold สำหรับโค้ดตั้งแต่ 10 บรรทัด จนถึง 20,000–50,000 บรรทัด
- บล็อก #1 (10 บรรทัด): ทำงานใน Normal Mode อัตโนมัติ (Auto Height พอดีตัว ไม่มี Scrollbar)
- บล็อก #2 (400 บรรทัด): สลับเข้าสู่ Virtual Mode อัตโนมัติ คุมความสูง 350px
- บล็อก #3 (1,000 บรรทัด): สลับเข้าสู่ Virtual Mode คุมความสูง 400px
- บล็อก #4 (20,000 บรรทัด): สลับเข้าสู่ Virtual Mode คุมความสูง 450px เรนเดอร์ใน DOM เพียง ~40 บรรทัด (ลด DOM Nodes ได้ 99.8%)
- มี Telemetry แสดงจำนวนบรรทัดรวม, จำนวน DOM Nodes ในจอ, และ % Memory ที่ประหยัดได้
- มีกล่องทดสอบ Paste ยืนยันว่าปุ่ม Copy ดึงโค้ดครบถ้วน 20,000 บรรทัดจาก VirtualBuffer โดยตรง

#### 📊 สถิติเปรียบเทียบผลทดสอบจริง (21,410 บรรทัด):
| รายการวัดผล | ⚡ มี VirtualBuffer | ❌ ไม่มี VirtualBuffer (Full Render) | ความแตกต่าง |
|---|:---:|:---:|:---:|
| **เวลา JS Tokenizer** | **2.7 ms** (0.0027 วิ) | **244.7 ms** (0.25 วิ) | **เร็วกว่า 90 เท่า** |
| **ขนาดสตริง HTML** | **101 KB** | **21.59 MB** | **เล็กลง 218 เท่า** |
| **จำนวน DOM Spans** | **~1,600 ชิ้น** | **~760,000 ชิ้น** | **ลดลง 99.8%** |
| **เวลา Browser Render** | **~15 - 30 ms** (พริบตาเดียว) | **~3,000 - 5,000 ms** (3-5 วิ) | **เร็วกว่า 100+ เท่า** |
| **อาการหน้าจอ (UI)** | **ลื่นไหลทันที 0 วิ (60 FPS)** | **หน้าเว็บค้างสนิท 3-5 วิ (UI Freeze)** | **ไม่ค้าง 100%** |
| **RAM ของแท็บเบราว์เซอร์** | **~2 - 3 MB** | **~250 - 400 MB** | **ประหยัดแรมมหาศาล** |

---

### Demo 11: Line Numbers & Line Highlighting (`11-line-numbers.html`)
**เป้าหมาย:** ทดสอบระบบเลขบรรทัด (Line Numbers) และแถบสีเน้นเฉพาะบรรทัด (Line Highlighting) ทั้งใน Normal Mode และ Virtual Scroll Mode
- บล็อก #1: 10 บรรทัด แสดงเลข 1 ถึง 10 ทางด้านซ้ายอย่างเป็นระเบียบ
- บล็อก #2: 12 บรรทัด แสดงเลขบรรทัดพร้อมแถบสีเน้นเฉพาะแถว `data-line="3, 6-8, 11"` พร้อมขอบเส้นสีทอง
- บล็อก #3: Virtual Scroll 400 บรรทัด แสดงเลขบรรทัดและไฮไลต์บรรทัด 5-8, 50, 100-105 แบบ Realtime ขณะเลื่อน Scroll
- บล็อก #4: Virtual Scroll 5,000 บรรทัด Gutter Width ขยายอัตโนมัติรองรับตัวเลข 4 หลัก โดยไม่ทำให้ข้อความโค้ดตกบรรทัด
- กล่องทดสอบ Paste: ยืนยันว่าการลากเมาส์คลุมก๊อปปี้ หรือการกดปุ่ม Copy ดึงเฉพาะโค้ดดิบสะอาด 100% ไม่มีเลขบรรทัดปนมาเลย

---

### หน้ารวม: `index.html`
- หน้า Landing Page สวยงาม เป็น Hub รวมลิงก์ไปแต่ละ Demo
- แสดงรายชื่อ Demo พร้อมคำอธิบายสั้น ๆ
- แสดงข้อมูลเวอร์ชัน และขนาดไฟล์ `dist/` โดยรวม

---

## ⚙️ หลักการทั่วไป
1. ทุกไฟล์ Demo จะโหลดไฟล์จากโฟลเดอร์ `../dist/` (ไฟล์ที่ build แล้วเท่านั้น ไม่ใช้ `src/`)
2. ทุกหน้ามี Panel แสดงผลการทดสอบ (✅ / ❌) ตรวจสอบอัตโนมัติผ่าน JavaScript assertion ง่ายๆ ท้ายหน้า
3. ทุกหน้าใช้ CSS พื้นฐานจัดรูปแบบให้ดูง่ายและสวยงาม (Dark background, ระยะห่างเหมาะสม)

---

## 🔄 ลำดับการดำเนินงาน
1. สร้างโฟลเดอร์ `demo/`
2. สร้าง `index.html` (หน้ารวมลิงก์)
3. สร้าง Demo 01 → 08 ตามลำดับ
4. ทดสอบเปิดแต่ละหน้าบน Browser จริง เพื่อตรวจผลลัพธ์
