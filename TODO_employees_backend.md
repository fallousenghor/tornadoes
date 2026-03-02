# TODO - Intégration Employees Backend

## Plan de migration des données locales vers le backend

- [x] 1. Créer le service employeeService.ts avec les méthodes CRUD
- [x] 2. Mettre à jour Employees.tsx pour utiliser les données du backend
- [x] 3. Mettre à jour EmployeeForm.tsx pour les opérations create/update
- [x] 4. Vérifier que les endpoints API correspondent au backend

## Détails

### 1. employeeService.ts (NOUVEAU)
- getEmployees() - GET /v1/employees ✓
- getEmployee(id) - GET /v1/employees/{id} ✓
- createEmployee(data) - POST /v1/employees ✓
- updateEmployee(id, data) - PUT /v1/employees/{id} ✓
- deleteEmployee(id) - DELETE /v1/employees/{id} (à ajouter si besoin)
- getDepartments() - GET /v1/departments ✓

### 2. Employees.tsx
- Remplacer employeesData mock par useEffect avec API ✓
- Ajouter états loading/error ✓
- Implémenter les filtres avec les données API ✓

### 3. EmployeeForm.tsx
- Modifier handleSubmit pour appeler l'API ✓
- Passer les departments via props ✓

