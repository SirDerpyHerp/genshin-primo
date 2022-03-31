import { Card, styled } from "@mui/material";
import theme from './MainTheme.scss'
  
const card = styled(Card)(({ nogradient }: {nogradient?: boolean}) => (
    nogradient ? {
      backgroundColor: theme.primary,
      borderRadius: '24px'
    } : {
      backgroundColor: theme.primary,
      borderRadius: '24px',
      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.03))`
    }
));
    
export default card