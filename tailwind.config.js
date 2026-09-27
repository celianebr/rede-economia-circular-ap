/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Paleta "Mapa dos Agentes da Economia Circular do Amapá"
                primary: '#2F5D3A',
                'primary-dark': '#1F4A2C',
                accent: '#2F5D3A',
                'accent-hover': '#1F4A2C',
                catador: '#2F5D3A',
                cooperativa: '#B9622E',
                empresa: '#3B5A73',
                pesquisador: '#6B4E8E',
                areia: '#FAF8F3',
                tinta: '#1C1B17',
                'texto-2': '#4A453B',
                'texto-3': '#6B6558',
                borda: '#E4DFD3',
                'borda-2': '#D8D2C4',
                // aliases mantidos por compatibilidade com componentes existentes
                'lz-primary': '#2F5D3A',
                'lz-green': '#2F5D3A',
                'lz-muted': '#F2F2F2',
            },
            fontFamily: {
                display: ['Fraunces', 'serif'],
                sans: ['Public Sans', 'sans-serif'],
            },
        }
    },
    plugins: [],
}
