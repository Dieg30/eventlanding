export const BANK_INFO = {
  bank:        'Banco Pichincha',
  accountType: 'Cuenta de Ahorros',
  holder:      'Diego Alexander Castro Benavides',
  fields: [
    { key: 'account', label: 'Número de cuenta', value: '2211137604'               },
    { key: 'cedula',  label: 'Cédula',            value: '1805670856'               },
    { key: 'email',   label: 'Correo',            value: 'diegoalexanderc30@gmail.com' },
  ],
} as const;

export type BankInfo = typeof BANK_INFO;
