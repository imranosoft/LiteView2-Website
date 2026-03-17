# LiteView2

**Modern WebView2 ActiveX Control for VBA & COM**

Embed a full Chromium-based browser inside Microsoft Access, Excel, VB6, and any ActiveX-compatible host application. Build modern HTML/CSS/JavaScript dashboards powered by real-time data from your existing VBA applications.

![LiteView2 in Microsoft Access](Screenshot1.PNG)

## Key Features

- **185+ API methods and properties** — navigation, scripting, DOM, messaging, cookies, downloads, and more
- **RecordsetBridge** — push DAO/ADO recordsets directly to JavaScript in a single VBA call
- **Bidirectional VBA-to-JavaScript messaging** — seamless communication between VBA and web content
- **Registered + Registration-Free COM** — deploy with or without admin rights and system registration
- **PDF export, printing, and screenshot capture** — built into the control
- **Multi-profile browsing** — isolated cookies, cache, and sessions per control instance
- **Cookie, download, and authentication management** — full control from VBA
- **Find in page, DevTools, CDP protocol** — professional browser capabilities
- **Zero runtime dependencies** — single self-contained OCX on Windows 10/11

---

## Getting Started

**Download [LiteView2_Demos.zip](LiteView2_Demos.zip)**, unzip, and you're ready to go.

### Folder Structure (keep intact)

```
LiteView2_Demo/
|-- LiteView2_x64.ocx              64-bit ActiveX control
|-- LiteView2_x86.ocx              32-bit ActiveX control
|-- LiteView2_Sales.accdb           Demo database (Registered mode)
|-- LiteView2_Sales_regFree.accdb   Demo database (RegFree mode)
|-- QUICK_START.txt                 Quick start instructions
|-- Access/
|   +-- demos/
|       |-- analytics_dashboard.html
|       |-- dashboard.html
|       |-- customer_detail.html
|       |-- data_entry.html
|       |-- invoice_template.html
|       |-- ... (19 HTML dashboards)
|       +-- fonts/
```

> **Important:** Do not move files out of this folder. The demo databases use relative paths (`Access\demos\`) to find the HTML files.

### Option A: Registration-Free Mode (no admin needed)

1. Unzip `LiteView2_Demo.zip` to any folder
2. Open `LiteView2_Sales_regFree.accdb` in Access
3. Open any demo form from the Navigation Pane

That's it. The OCX loads automatically via embedded manifest — no `regsvr32` required.

### Option B: Registered Mode (one-time setup)

1. Unzip `LiteView2_Demo.zip` to any folder
2. Open **Command Prompt as Administrator** and register the OCX:

   **64-bit Access:**
   ```
   regsvr32 "C:\path\to\LiteView2_Demo\LiteView2_x64.ocx"
   ```
   **32-bit Access:**
   ```
   regsvr32 "C:\path\to\LiteView2_Demo\LiteView2_x86.ocx"
   ```
3. Open `LiteView2_Sales.accdb` in Access
4. Open any demo form from the Navigation Pane

> **Check your Access bitness:** File > Account > About Microsoft Access — look for "64-bit" or "32-bit"

---

## Quick Start (VBA Code)

```vb
Private WithEvents m_lv As LiteView2.LiteView2Ctrl

Private Sub Form_Load()
    Set m_lv = Me.LiteView2Ctrl1.Object
End Sub

Private Sub m_lv_WebViewReady()
    m_lv.SetLocalContentRoot CurrentProject.Path & "\Access\demos"
    m_lv.Navigate "https://lv2.local/analytics_dashboard.html"
End Sub

Private Sub m_lv_WebMessageReceived(ByVal message As String, ByVal source As String)
    ' Handle messages from JavaScript
    MsgBox "Received: " & message
End Sub
```

## Demo Screenshots

| | |
|---|---|
| ![Screenshot 2](Screenshot2.png) | ![Screenshot 3](Screenshot3.png) |
| ![Screenshot 4](Screenshot4.png) | ![Screenshot 5](Screenshot5.png) |

## Demo Video

[![LiteView2 Demo — Modern HTML Dashboard in Microsoft Access](https://img.youtube.com/vi/FQF7QsE7laI/maxresdefault.jpg)](https://youtu.be/FQF7QsE7laI?si=EmFnd7ATFFBLN1v_)

## What's Included

| File | Description |
|------|-------------|
| `LiteView2_Demos.zip` | Ready-to-run demo package (download this) |
| `07_Cookbook.md` / `.pdf` | Recipes and patterns for common tasks |
| `LiteView2_Product_Brochure.pdf` | Product overview brochure |
| `EULA.md` | End User License Agreement |

## Licensing

- **30-day free trial** — fully functional, no registration required
- **PRO License ($149)** — perpetual, single developer, royalty-free deployment
- **Enterprise License ($399)** — perpetual, up to 5 developers, redistribution rights

All licenses are perpetual. Optional annual renewal covers updates and support only — the control never stops working. Offline activation, no internet required.

See [EULA.md](EULA.md) for full license terms.

## Documentation

- [Cookbook](07_Cookbook.md) — step-by-step recipes and patterns

## System Requirements

- Windows 10 or Windows 11
- Microsoft Edge WebView2 Runtime (pre-installed on modern Windows)
- Any ActiveX host: Microsoft Access, Excel, VB6, or compatible container

## Contact

For licensing, support, and inquiries: imranbhatti800@gmail.com
