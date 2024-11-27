/* eslint-env node */
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	fontFamily: {
  		sans: ["Inter", "sans-serif"],
  		serif: ["Joesfin Slab", "serif"]
  	},
  	extend: {
  		colors: {
  			fern: {
  				'50': '#f5f9f4',
  				'100': '#e8f2e6',
  				'200': '#d2e5cd',
  				'300': '#adcfa6',
  				'400': '#81b177',
  				'500': '#5e9453',
  				'600': '#497740',
  				'700': '#3c6035',
  				'800': '#334d2e',
  				'900': '#2a4027',
  				'950': '#132211'
  			},
  			steel: {
  				'50': '#f3f7fc',
  				'100': '#e6eff8',
  				'200': '#c7def0',
  				'300': '#95c2e4',
  				'400': '#5ca2d4',
  				'500': '#3581b8',
  				'600': '#276ba2',
  				'700': '#215583',
  				'800': '#1f496d',
  				'900': '#1e3e5c',
  				'950': '#14293d'
  			},
  			'hit-pink': {
  				'50': '#fff5ed',
  				'100': '#ffe8d5',
  				'200': '#fdceab',
  				'300': '#fcb07e',
  				'400': '#f97d3e',
  				'500': '#f75a18',
  				'600': '#e8400e',
  				'700': '#c02e0e',
  				'800': '#992613',
  				'900': '#7b2113',
  				'950': '#420d08'
  			},
  			alabaster: {
  				'50': '#f7f8f5',
  				'100': '#edefe9',
  				'200': '#dee2d6',
  				'300': '#bec6af',
  				'400': '#99a484',
  				'500': '#798562',
  				'600': '#626c4d',
  				'700': '#4d563f',
  				'800': '#404635',
  				'900': '#353a2d',
  				'950': '#1a1e15'
  			},
  			rose: {
  				'50': '#fdf2f6',
  				'100': '#fce7f0',
  				'200': '#fbcfe1',
  				'300': '#faa7c7',
  				'400': '#f46197',
  				'500': '#ed477f',
  				'600': '#dd255a',
  				'700': '#bf1743',
  				'800': '#9e1638',
  				'900': '#841732',
  				'950': '#510618'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
