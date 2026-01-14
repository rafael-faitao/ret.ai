# Testing the API

## Using cURL

### Test Text-to-Layout
```bash
curl -X POST http://localhost:3000/api/retail-layout/generate-from-text \
  -H "Content-Type: application/json" \
  -d '{
    "description": "A small convenience store with snacks, beverages, and a cash counter near the entrance"
  }'
```

### Test Image-to-Layout
```bash
curl -X POST http://localhost:3000/api/retail-layout/generate-from-image \
  -F "image=@path/to/store-layout.jpg"
```

## Using PowerShell (Windows)

### Test Text-to-Layout
```powershell
$body = @{
    description = "A medium-sized grocery store with fresh produce, dairy, bakery sections, 2 entrances, and 4 checkout counters"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/retail-layout/generate-from-text" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### Test Image-to-Layout
```powershell
$filePath = "C:\path\to\store-image.jpg"
$fileName = Split-Path $filePath -Leaf

$boundary = [System.Guid]::NewGuid().ToString()
$bodyLines = @(
    "--$boundary",
    "Content-Disposition: form-data; name=`"image`"; filename=`"$fileName`"",
    "Content-Type: image/jpeg",
    "",
    [System.IO.File]::ReadAllText($filePath),
    "--$boundary--"
) -join "`r`n"

Invoke-RestMethod -Uri "http://localhost:3000/api/retail-layout/generate-from-image" `
  -Method Post `
  -Body $bodyLines `
  -ContentType "multipart/form-data; boundary=$boundary"
```

## Using Postman/Insomnia

### Text-to-Layout
1. Create a new POST request
2. URL: `http://localhost:3000/api/retail-layout/generate-from-text`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "description": "A large supermarket with multiple aisles for groceries, electronics section, and self-checkout stations"
}
```

### Image-to-Layout
1. Create a new POST request
2. URL: `http://localhost:3000/api/retail-layout/generate-from-image`
3. Body: form-data
4. Add field: `image` (type: File)
5. Select an image file

## Sample Response

```json
{
  "id": "layout-1705200000000",
  "name": "Grocery Store",
  "description": "A medium-sized grocery store...",
  "gridSize": 20,
  "canvasSize": 800,
  "shelves": [
    {
      "name": "Fresh Produce",
      "x": 200,
      "y": 150,
      "width": 120,
      "height": 80,
      "orientation": 0,
      "color": "#4CAF50",
      "categories": ["fruits", "vegetables"]
    },
    {
      "name": "Dairy",
      "x": 350,
      "y": 150,
      "width": 120,
      "height": 80,
      "orientation": 0,
      "color": "#2196F3",
      "categories": ["milk", "cheese", "yogurt"]
    }
  ],
  "structureObjects": [
    {
      "name": "Main Entrance",
      "type": "entrance_exit",
      "x": 100,
      "y": 700,
      "width": 60,
      "height": 60,
      "orientation": 0
    },
    {
      "name": "Checkout 1",
      "type": "cash_counter",
      "x": 150,
      "y": 600,
      "width": 50,
      "height": 50,
      "orientation": 0
    }
  ]
}
```

## Error Responses

### Missing Description
```json
{
  "statusCode": 400,
  "message": ["description should not be empty", "description must be a string"],
  "error": "Bad Request"
}
```

### No Image File
```json
{
  "statusCode": 400,
  "message": "No image file provided",
  "error": "Bad Request"
}
```

## Testing in Browser DevTools

Open the browser console on http://localhost:4200 and run:

```javascript
// Test text-to-layout
fetch('http://localhost:3000/api/retail-layout/generate-from-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'A small corner store with a refrigerated section and checkout counter'
  })
})
.then(r => r.json())
.then(console.log);

// Test with file input (after selecting a file in the UI)
const fileInput = document.querySelector('input[type="file"]');
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('http://localhost:3000/api/retail-layout/generate-from-image', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(console.log);
```
