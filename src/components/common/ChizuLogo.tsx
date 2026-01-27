import styled from 'styled-components'

interface ChizuLogoProps {
  size?: number
}

const LogoContainer = styled.div<{ $size: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const LogoText = styled.span<{ $size: number }>`
  font-size: ${({ $size }) => $size}px;
  font-weight: 800;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`

export function ChizuLogo({ size = 24 }: ChizuLogoProps) {
  return (
    <LogoContainer $size={size}>
      <svg
        width={size * 1.2}
        height={size * 1.2}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cheeseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFA500" />
            <stop offset="100%" stopColor="#FF8C00" />
          </linearGradient>
          <linearGradient id="cheeseDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E5BE00" />
            <stop offset="100%" stopColor="#CC7000" />
          </linearGradient>
        </defs>

        {/* 지도 핀 모양의 치즈 */}
        <path
          d="M24 4C15.163 4 8 11.163 8 20C8 31 24 44 24 44C24 44 40 31 40 20C40 11.163 32.837 4 24 4Z"
          fill="url(#cheeseGradient)"
          stroke="url(#cheeseDark)"
          strokeWidth="2"
        />

        {/* 치즈 구멍들 */}
        <circle cx="20" cy="18" r="3" fill="#FFF8DC" opacity="0.8" />
        <circle cx="28" cy="22" r="2.5" fill="#FFF8DC" opacity="0.8" />
        <circle cx="22" cy="26" r="2" fill="#FFF8DC" opacity="0.8" />
        <circle cx="26" cy="15" r="1.5" fill="#FFF8DC" opacity="0.7" />

        {/* 하이라이트 */}
        <path
          d="M18 12C18 12 20 10 24 10C28 10 32 12 34 16"
          stroke="#FFEB3B"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
          fill="none"
        />
      </svg>
      <LogoText $size={size}>Chizu</LogoText>
    </LogoContainer>
  )
}
