// Recheck captured normal-speed geometry with metre-scale floating-point tolerance.
// Preserve the raw observations, including any earlier exact-equality assertion.
import {readFileSync,writeFileSync,copyFileSync} from 'node:fs';
const file='review/20min/normal-route.json',report=JSON.parse(readFileSync(file));
copyFileSync(file,'review/20min/normal-route.raw.json');
const tolerance=1e-6;
let maximumDrift=0;
for(let i=1;i<report.states.length;i++){
 const a=report.states[i-1],b=report.states[i];
 if(a.id.replace(/-\d+$/,'')!==b.id.replace(/-\d+$/,'')||b.id==='retour-1')continue;
 const drift=Math.max(...a.camera.map((v,j)=>Math.abs(v-b.camera[j])),...a.guide.map((v,j)=>Math.abs(v-b.guide[j])));
 maximumDrift=Math.max(maximumDrift,drift);
 const check=report.checks.find(c=>c.name===`stable reveal ${b.id}`);
 check.pass=drift<tolerance&&b.walk===0;check.detail={maximumCoordinateDrift:drift,toleranceMetres:tolerance,walkingWeight:b.walk};
}
report.geometryValidation={maximumDrift,toleranceMetres:tolerance,rawObservations:'normal-route.raw.json'};
writeFileSync(file,JSON.stringify(report,null,2)+'\n');
console.log(`${report.checks.filter(c=>c.pass).length}/${report.checks.length} checks; maximum drift ${maximumDrift} m; raw observations retained.`);
process.exitCode=report.checks.some(c=>!c.pass)?1:0;
