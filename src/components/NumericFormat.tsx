import { FC, Fragment } from 'react';

interface FormatPriceProps {
  price: number;
  isDecimal?: boolean;
}
const FormatPrice: FC<FormatPriceProps> = ({ price, isDecimal = false }) => {
  // Format the number using Intl.NumberFormat for Indian Rupees (INR)
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: isDecimal ? 2 : 0
  }).format(price);

  return <Fragment>{formattedNumber}</Fragment>;
};

export default FormatPrice;
