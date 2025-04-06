# Global Wellness Insights

A comprehensive platform for exploring global wellness metrics and understanding how different societal structures influence well-being across countries.

## Features

- **Interactive Data Visualization**: Dynamic charts and graphs powered by Recharts
- **Comprehensive Metrics**: Access to multiple wellness indicators from authoritative sources
- **Historical Analysis**: Track changes and trends from 2010 to present
- **Quality Indicators**: Reliability scores and data quality metrics for transparency
- **Dark Theme**: Modern, eye-friendly design optimized for data visualization
- **Responsive Design**: Fully responsive layout that works on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Typography plugin
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Font**: Inter (Google Fonts)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/global-wellness.git
   cd global-wellness
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
global-wellness/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── api/
│   │   └── wellness-data/
│   │       └── route.ts
│   ├── methodology/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CountrySelector.tsx
│   ├── MetricSelector.tsx
│   ├── SocietalStructuresContext.tsx
│   └── WellnessInsights.tsx
├── public/
│   └── og-image.png
├── README.md
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Data Sources

- World Health Organization (WHO)
- United Nations Educational, Scientific and Cultural Organization (UNESCO)
- Organisation for Economic Co-operation and Development (OECD)
- World Happiness Report
- Gallup World Poll
- Various National Statistical Offices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- Email: info@globalwellnessinsights.org
- Twitter: [@GlobalWellness](https://twitter.com/GlobalWellness)
- LinkedIn: [Global Wellness Insights](https://linkedin.com/company/global-wellness-insights)

## Acknowledgments

- Data providers and research organizations
- Open-source community and contributors
- Users and stakeholders providing valuable feedback 