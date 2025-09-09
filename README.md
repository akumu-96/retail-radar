# Fraud Detection System

A lightweight, rule-based fraud detection module for transaction monitoring. This system analyzes transaction data, assigns fraud scores, and generates actionable insights to help mitigate risk.

---

## Features

- **File Upload**: Easily upload transaction data for analysis.

- **Fraud Detection**: Identify potential fraud with AI-driven insights.

- **Real-Time Monitoring**: Keep track of transactions as they happen.

- **Advanced Analytics**: Utilize predictive analytics to foresee potential risks.

- **Interactive Heatmaps**: Visualize fraud data geographically.

- **AI Insights**: Get actionable recommendations based on fraud patterns.

- **Export Reports**: Generate and export detailed reports for further analysis.

---

## Installation

1. Clone the repository:

   ```bash

   git clone https://github.com/your-username/your-repo.git

   ```

2. Install dependencies:

   ```bash

   npm install

   ```

---

## Usage

### Input Data Structure

The module expects an array of `TransactionData` objects with the following fields:

```typescript

interface TransactionData {

  Amount: number;

  PaymentType: string;

  Timestamp: string; // ISO format

  StoreID: string;

  ProductID: string;

}

```

### Example Usage

```typescript

import { detectFraud } from './fraudDetection';

const transactions = [

  {

    Amount: 1200,

    PaymentType: 'Cash',

    Timestamp: '2025-09-09T03:00:00Z',

    StoreID: 'ST001',

    ProductID: 'GIFT001'

  },

  // ... more transactions

];

const { processedData, insights } = await detectFraud(transactions);

console.log(processedData, insights);

```

### Output

- **`processedData`**: Array of transactions enriched with `fraudScore`, `riskLevel`, and `fraudType`.

- **`insights`**: Array of `FraudInsight` objects with actionable recommendations.

---

## Fraud Detection Rules

| Rule                     | Score Impact | Description                          |

|--------------------------|--------------|--------------------------------------|

| High Amount (>1000)      | +0.3         | Unusually large transaction          |

| Low Amount (<1)          | +0.4         | Suspiciously small transaction       |

| Large Cash Transaction   | +0.2         | Cash payment over 500                |

| Off-Hours Activity       | +0.25        | Transaction outside 6 AM–10 PM       |

| High-Risk Store          | +0.2         | Store with historical fraud issues   |

| High-Risk Product        | +0.3         | Gift cards or returns                |

---

## Insights Generated

1. **High-Risk Store Alert**: Flags stores with fraud rates >30%.

2. **Payment Method Risk**: Identifies the riskiest payment type.

3. **Temporal Fraud Pattern**: Highlights peak fraud hours.

4. **Elevated Fraud Risk**: Warns if overall fraud rate exceeds 5%.

---

## API Reference

### `detectFraud(data: TransactionData[])`

- **Parameters**: Array of transactions.

- **Returns**: `{ processedData, insights }`

  - `processedData`: Transactions with fraud metadata.

  - `insights`: Array of `FraudInsight` objects.

### `FraudInsight` Structure

```typescript

interface FraudInsight {

  type: string;          // e.g., "High-Risk Store Alert"

  description: string;   // Detailed issue description

  impact: string;        // Potential consequences

  recommendation: string;// Suggested action

  priority: 'High' | 'Medium' | 'Low';

}

```

---

## Contributing

Contributions are welcome! Open an issue or submit a PR for:

- New fraud detection rules.

- Performance optimizations.

- Enhanced insight generation.

---

## License

MIT
