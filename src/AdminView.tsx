import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

export default function AdminView() {
  return (
    <ThemeProvider theme={theme}>
      <div>hi</div>
    </ThemeProvider>
  );
}
