// QR для друку — вбудованими засобами macOS, без сторонніх бібліотек.
//
//   swift brand/print/qr.swift encode "https://mychurch.com.ua/?utm_source=…"
//       → матриця модулів рядками з 0 і 1 (без тихої зони: її малює верстка)
//   swift brand/print/qr.swift decode out/preview/rollup.png
//       → що прочитав у картинці розпізнавач Vision, по рядку на код
//
// Кодує CoreImage (CIQRCodeGenerator), читає Vision (VNDetectBarcodesRequest):
// два незалежні механізми Apple, тож «закодували → прочитали те саме» — це
// справжня перевірка, а не самоповтор. `build.py` кличе обидва режими.

import CoreImage
import Foundation
import Vision

func encode(_ text: String, level: String) -> [[Bool]] {
    guard let filter = CIFilter(name: "CIQRCodeGenerator") else { fatalError("немає CIQRCodeGenerator") }
    filter.setValue(text.data(using: .utf8), forKey: "inputMessage")
    filter.setValue(level, forKey: "inputCorrectionLevel")
    guard let image = filter.outputImage else { fatalError("QR не згенерувався") }

    // Один модуль = один піксель. Малюємо в відомий буфер RGBA і читаємо.
    let w = Int(image.extent.width), h = Int(image.extent.height)
    var px = [UInt8](repeating: 0, count: w * h * 4)
    let ctx = CIContext(options: [.workingColorSpace: NSNull()])
    ctx.render(image, toBitmap: &px, rowBytes: w * 4, bounds: image.extent,
               format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
    var grid = (0..<h).map { y in (0..<w).map { x in px[(y * w + x) * 4] < 128 } }

    // CoreImage додає свою тиху зону — обрізаємо до крайніх темних модулів.
    let rows = grid.indices.filter { grid[$0].contains(true) }
    let cols = (0..<w).filter { x in grid.contains { $0[x] } }
    grid = Array(grid[rows.first!...rows.last!]).map { Array($0[cols.first!...cols.last!]) }
    return grid
}

func decode(_ path: String) -> [String] {
    let request = VNDetectBarcodesRequest()
    request.symbologies = [.qr]
    let handler = VNImageRequestHandler(url: URL(fileURLWithPath: path), options: [:])
    try? handler.perform([request])
    return (request.results ?? []).compactMap { $0.payloadStringValue }
}

let args = CommandLine.arguments
guard args.count >= 3 else {
    FileHandle.standardError.write("usage: qr.swift encode <text> [L|M|Q|H] | decode <png>\n".data(using: .utf8)!)
    exit(2)
}
switch args[1] {
case "encode":
    let grid = encode(args[2], level: args.count > 3 ? args[3] : "Q")
    print(grid.map { $0.map { $0 ? "1" : "0" }.joined() }.joined(separator: "\n"))
case "decode":
    decode(args[2]).forEach { print($0) }
default:
    exit(2)
}
