-- Create sequence for generating employee IDs
create sequence employeeid_seq start with 1001 increment by 1 nocache
nocycle;
/

-- Procedure to insert a new employee
create or replace procedure employee_hire_sp (
   p_dept_id in number,
   p_salary  in number
) is
begin
   insert into employees (
      employee_id,
      dept_id,
      salary
   ) values ( employeeid_seq.nextval,
              p_dept_id,
              p_salary );

   commit;
end;
/

-- Test employee_hire_sp
begin
   employee_hire_sp(
      10,   -- dept_id
      5500  -- salary
   );
end;
/

-- Function to return job title based on job_id
create or replace function get_job (
   p_job_id in varchar2
) return varchar2 is
   v_title hr_jobs.job_title%type;
begin
   select job_title
     into v_title
     from hr_jobs
    where job_id = p_job_id;

   return v_title;
exception
   when no_data_found then
      return 'Job Not Found';
end;
/

-- Procedure to insert a new job
create or replace procedure new_job (
   p_job_id     in varchar2,
   p_job_title  in varchar2,
   p_min_salary in number,
   p_max_salary in number
) is
begin
   insert into hr_jobs (
      job_id,
      job_title,
      min_salary,
      max_salary
   ) values ( p_job_id,
              p_job_title,
              p_min_salary,
              p_max_salary );

   commit;
end;
/

-- Test new_job procedure
begin
   new_job(
      'IT_TESTER',
      'QA Tester',
      4000,
      7000
   );
end;
/

-- Procedure to validate salary range for a job
create or replace procedure check_salary_range_sp (
   p_job_id in varchar2,
   p_salary in number
) is
   v_min_salary hr_jobs.min_salary%type;
   v_max_salary hr_jobs.max_salary%type;
begin
   select min_salary,
          max_salary
     into
      v_min_salary,
      v_max_salary
     from hr_jobs
    where job_id = p_job_id;

   if p_salary < v_min_salary
   or p_salary > v_max_salary then
      raise_application_error(
         -20001,
         'Salary is outside the allowed range.'
      );
   end if;
end;
/

-- Trigger to enforce salary range on employee insert/update
create or replace trigger trg_check_salary before
   insert or update of salary on employees
   for each row
begin
    -- Uses a hardcoded job_id (IT_TESTER) for demo purposes
   check_salary_range_sp(
      'IT_TESTER',
      :new.salary
   );
end;
/

-- Test insert that passes salary validation
insert into employees (
   employee_id,
   dept_id,
   salary
) values ( employeeid_seq.nextval,
           10,
           5000 );