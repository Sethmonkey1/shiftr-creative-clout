// Verified against each live reference '+' control on 2026-10-10.
export const referencePricing = [
 {name:'Hype Video',base:5900,seconds:30,increment:1750},
 {name:'Explainer Video',base:8400,seconds:60,increment:900},
 {name:'Brand Narrative Video',base:9800,seconds:90,increment:900},
];
export function referenceQuote(plan,blocks){const count=Math.max(0,Math.floor(blocks));return {seconds:plan.seconds+15*count,price:plan.base+plan.increment*count};}
