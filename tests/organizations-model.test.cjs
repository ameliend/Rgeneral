/* Run with node --test tests/organizations-model.test.cjs. No dependencies. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const vm = require('node:vm');

function model() {
  const values = new Map();
  const storage = {fail: false, getItem: key => values.get(key) || null, setItem(key, value) {if(this.fail) throw new Error('quota'); values.set(key, value);}};
  const companies = [
    {id:'s1',data:{name:'A'},example:true,ownership:{total:1000},registers:{movements:[{order:1}]}},
    {id:'s2',data:{name:'B'},demoFixture:true},
    {id:'s3',data:{name:'C'},demoFixture:true}
  ];
  const context = vm.createContext({document:{addEventListener(){}},localStorage:storage,companies,normalizedSearch: text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(),profile:{firstname:'Test',lastname:'Owner',email:''}});
  vm.runInContext(readFileSync(resolve(__dirname,'../organizations.js'),'utf8'),context);
  const run = source => vm.runInContext(source,context);
  run(`initializeOrganizations(companies,profile);orgLink('s2').cabinetId='c-lyon';orgLink('s2').plan='acces';`);
  return {run,storage,companies};
}

test('administration is independent of legal rights, scoped roles can differ by cabinet',()=>{
  const {run}=model();
  assert.equal(run(`orgCanManage('lea','c-paris','g-novea')`),true);
  assert.equal(run(`orgCompanyLegalLevel('lea','s1','titres').level`),'none');
  assert.equal(run(`orgEffectiveAccess('lea','s2','titres').level`),'read');
  assert.equal(run(`orgCanManage('lea','c-lyon','g-novea')`),false);
  assert.equal(run(`orgEffectiveAccess('alex','s1','titres').level`),'read');
  assert.equal(run(`orgEffectiveAccess('alex','s2','titres').level`),'none');
});

test('a company licence caps a write role, without granting access by itself',()=>{
  const {run}=model();
  assert.equal(run(`orgCompanyLegalLevel('hugo','s2','documents').level`),'write');
  assert.equal(run(`orgEffectiveAccess('hugo','s2','documents').level`),'read');
  assert.equal(run(`orgEffectiveAccess('hugo','s2','custom-decisions').level`),'read');
  run(`orgLink('s2').plan='premium'`);
  assert.equal(run(`orgEffectiveAccess('hugo','s2','documents').level`),'write');
  assert.equal(run(`orgEffectiveAccess('alex','s2','documents').level`),'none');
  run(`orgLink('s2').plan='conservation'`);
  assert.equal(run(`orgEffectiveAccess('hugo','s2','titres').level`),'read');
  assert.equal(run(`orgEffectiveAccess('hugo','s2','certifications').level`),'none');
});

test('delegation shares a dossier and caps recipient permissions without duplicating company data',()=>{
  const {run,companies}=model();
  const before=JSON.stringify(companies);
  run(`organizationWorkspace.delegations.push({id:'share',companyId:'s1',cabinetId:'c-lyon',level:'read'});organizationWorkspace.context.cabinetId='c-lyon';`);
  assert.equal(run(`orgCompaniesInContext().filter(e=>e.id==='s1').length`),1);
  assert.equal(run(`orgEffectiveAccess('hugo','s1','titres').level`),'read');
  run(`organizationWorkspace.delegations[0].level='write'`);
  assert.equal(run(`orgEffectiveAccess('hugo','s1','titres').level`),'write');
  assert.equal(JSON.stringify(companies),before);
});

test('changing one company licence leaves others and their records untouched',()=>{
  const {run,companies}=model();
  const before=JSON.stringify(companies),otherPlan=run(`orgLink('s2').plan`);
  run(`orgCommit(()=>{orgLink('s1').plan='illimite';orgLink('s1').cabinetId='c-lyon';})`);
  assert.equal(run(`orgLink('s2').plan`),otherPlan);
  assert.equal(JSON.stringify(companies),before);
  run(`organizationWorkspace=null;initializeOrganizations(companies,profile)`);
  assert.equal(run(`orgLink('s1').plan`),'illimite');
  assert.equal(run(`orgLink('s1').cabinetId`),'c-lyon');
});

test('failed storage restores the organisation and can be retried',()=>{
  const {run,storage}=model();
  const before=run(`JSON.stringify(organizationWorkspace)`);
  storage.fail=true;
  assert.throws(()=>run(`orgCommit(()=>{orgLink('s1').plan='premium';})`),/indisponible/);
  assert.equal(run(`JSON.stringify(organizationWorkspace)`),before);
  storage.fail=false;
  run(`orgCommit(()=>{orgLink('s1').plan='premium';})`);
  assert.equal(run(`orgLink('s1').plan`),'premium');
});

test('normalization preserves custom role ownership and rejects foreign scopes/shares',()=>{
  const {run}=model();
  run(`organizationWorkspace.roles.push({id:'custom',name:'Audit',groupId:'g-novea',management:'none',permissions:orgPermissionMap('read')});organizationWorkspace.assignments.push({id:'foreign-role',personId:'alex',roleId:'custom',scope:'cabinet',scopeId:'c-bordeaux'});organizationWorkspace.delegations.push({id:'foreign-share',companyId:'s1',cabinetId:'c-bordeaux',level:'write'});organizationWorkspace=normalizeOrganizations(organizationWorkspace);`);
  assert.equal(run(`orgRole('custom').groupId`),'g-novea');
  assert.equal(run(`organizationWorkspace.assignments.some(a=>a.id==='foreign-role')`),false);
  assert.equal(run(`organizationWorkspace.delegations.some(d=>d.id==='foreign-share')`),false);
});
