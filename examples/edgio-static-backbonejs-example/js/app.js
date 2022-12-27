window.EmployeeManager = {
    Models: {},
    Collections: {},
    Views: {},

    start: function(data) {
        var employees = new EmployeeManager.Collections.Employees(data.employees),
        router = new EmployeeManager.Router();

        router.on('route:home', function() {
            router.navigate('employees', {
                trigger: true,
                replace: true
            });
        });

        router.on('route:showEmployees', function() {
            var employeesView = new EmployeeManager.Views.Employees({
                collection: employees
            });

            $('.main-container').html(employeesView.render().$el);
        });

        router.on('route:newEmployee', function() {
            var newEmployeeForm = new EmployeeManager.Views.EmployeeForm({
                model: new EmployeeManager.Models.Employee()
            });

            newEmployeeForm.on('form:submitted', function(attrs) {
                attrs.id = employees.isEmpty() ? 1 : (_.max(employees.pluck('id')) + 1);
                employees.add(attrs);
                router.navigate('employees', true);
            });

            $('.main-container').html(newEmployeeForm.render().$el);
        });

        router.on('route:editEmployee', function(id) {
            var employee = employees.get(id),
            editEmployeeForm;

            if (employee) {
                editEmployeeForm = new EmployeeManager.Views.EmployeeForm({
                    model: employee
                });

                editEmployeeForm.on('form:submitted', function(attrs) {
                    employee.set(attrs);
                    router.navigate('employees', true);
                });

                $('.main-container').html(editEmployeeForm.render().$el);
            } else {
                router.navigate('employees', true);
            }
        });

        Backbone.history.start();
    }
};