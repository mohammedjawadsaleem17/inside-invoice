export default function CompanyStamp({
  companyName = "RS HARDWARE GLASS & ELECTRICALS",
  addressLine1 = "Building No-3/7, Shop No-6, Gowri Shankar Complex",
  addressLine2 = "Arekere Main Road, Bangalore - 560076",
  phone = "Ph: +91 8147465517, 9066309842",
  email = "E-Mail: rshardware2210@gmail.com",
  color = "#0000cc",
  width = 400,
}) {
  const height = Math.round(width * 0.4);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <rect x="4" y="4" width="392" height="152" rx="3" ry="3"
            fill="none" stroke={color} strokeWidth="4" />

      <rect x="12" y="12" width="376" height="136" rx="2" ry="2"
            fill="none" stroke={color} strokeWidth="1.5" />

      <text x="200" y="50" textAnchor="middle"
            fontFamily="Arial, sans-serif" fontWeight="bold"
            fontSize="24" fill={color}>
        {companyName}
      </text>

      <line x1="24" y1="60" x2="376" y2="60"
            stroke={color} strokeWidth="1" />

      <text x="200" y="80" textAnchor="middle"
            fontFamily="Arial, sans-serif" fontSize="13" fill={color}>
        {addressLine1}
      </text>

      <text x="200" y="97" textAnchor="middle"
            fontFamily="Arial, sans-serif" fontSize="13" fill={color}>
        {addressLine2}
      </text>

      <text x="200" y="114" textAnchor="middle"
            fontFamily="Arial, sans-serif" fontSize="13" fill={color}>
        {phone}
      </text>

      <text x="200" y="131" textAnchor="middle"
            fontFamily="Arial, sans-serif" fontSize="13" fill={color}>
        {email}
      </text>
    </svg>
  );
}
