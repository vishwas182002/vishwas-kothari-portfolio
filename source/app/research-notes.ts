// Editorial summaries drawn from the original portfolio descriptions.
export const researchNotes = [
  {
    title: 'What the score hides',
    question: 'Can a good overall score hide a numerical reasoning failure?',
    method: '5 models · 397 questions · 79 financial-document images',
    finding:
      'One model performed reasonably overall, but collapsed on numerical reasoning.',
    takeaway:
      'Break the score down by the kind of question. The average can miss the failure.',
  },
  {
    title: 'Beyond the clean benchmark',
    question: 'What changes when the input is a real financial report?',
    method:
      'Dense tables, scanned layouts, and 307 curated examples for LoRA fine-tuning',
    finding:
      'Fine-tuning moved ANLS from 0.137 to 0.168. Improvement, with plenty of room left.',
    takeaway:
      'A relative gain needs its starting point. Keep the absolute scores in view.',
  },
  {
    title: 'Ask why, then audit',
    question:
      'What drove the credit prediction, and how did it behave across groups?',
    method: '30,000 records · SHAP, LIME, DiCE · an audit across 4 attributes',
    finding:
      'Test ROC-AUC: 0.782. No fairness violations were detected in the tested setup.',
    takeaway:
      'The explanation and the audit belong beside the prediction. The tested scope matters.',
  },
  {
    title: 'The optimizer leaves a trace',
    question: 'Does the training rule change what a model learns to rely on?',
    method:
      'Controlled optimizer experiments, then MNIST with spurious patch features',
    finding:
      'In the tested setting, the OOD drop was 30.2% for SGD and 13.6% for Adam.',
    takeaway:
      'Same data, different training rules. Check what happens outside the training distribution.',
  },
];
