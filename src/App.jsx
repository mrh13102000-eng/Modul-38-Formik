import { useState } from "react";
import { useFormik } from "formik";

function Field({ formik, id, label, type = "text", hint, children }) {
  const error = formik.touched[id] && formik.errors[id];
  const valid = formik.touched[id] && !formik.errors[id];

  return (
    <div
      className={`field ${error ? "is-error" : ""} ${valid ? "is-valid" : ""}`}
    >
      <label htmlFor={id}>{label}</label>
      <div className="control">
        <input
          id={id}
          name={id}
          type={type}
          value={formik.values[id]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-note`}
          autoComplete={id === "password" ? "new-password" : id}
        />
        {children}
      </div>
      <p id={`${id}-note`} className="note">
        {error ? error : hint}
      </p>
    </div>
  );
}

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [submittedName, setSubmittedName] = useState(null);
  const [shake, setShake] = useState(false);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },

    validate: (values) => {
      const errors = {};

      if (!values.name) {
        errors.name = "Nama wajib diisi.";
      } else if (values.name.length < 5) {
        errors.name = `Nama kurang ${5 - values.name.length} huruf lagi (minimal 5).`;
      } else if (values.name.length > 12) {
        errors.name = `Nama kelebihan ${values.name.length - 12} huruf (maksimal 12).`;
      }

      if (!values.email) {
        errors.email = "Email wajib diisi.";
      }

      if (!values.password) {
        errors.password = "Password wajib diisi.";
      } else if (values.password.length < 6) {
        errors.password = `Password kurang ${6 - values.password.length} huruf lagi (minimal 6).`;
      }

      return errors;
    },

    onSubmit: (values, { resetForm }) => {
      console.log("Data terkirim:", values);
      setSubmittedName(values.name);
      resetForm();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      formik.setTouched({ name: true, email: true, password: true });
      setShake(true);
      document.getElementById(Object.keys(errors)[0])?.focus();
      return;
    }

    formik.handleSubmit(e);
  };

  if (submittedName) {
    return (
      <main className="page">
        <section className="card" role="status">
          <h1>Akun dibuat</h1>
          <p className="lead">
            Selamat datang, {submittedName}. Data kamu sudah tercatat di
            console.
          </p>
          <button className="btn" onClick={() => setSubmittedName(null)}>
            Isi form lagi
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card">
        <h1>Buat akun</h1>
        <p className="lead">Isi data di bawah untuk mulai.</p>

        <form
          onSubmit={handleSubmit}
          onAnimationEnd={() => setShake(false)}
          className={shake ? "shake" : ""}
          noValidate
        >
          <Field
            formik={formik}
            id="name"
            label="Nama"
            hint="5 sampai 12 huruf."
          >
            <span
              className={`counter ${formik.values.name.length > 12 ? "over" : ""}`}
              aria-hidden="true"
            >
              {formik.values.name.length}/12
            </span>
          </Field>

          <Field
            formik={formik}
            id="email"
            label="Email"
            type="email"
            hint="Dipakai untuk login."
          />

          <Field
            formik={formik}
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            hint="Minimal 6 karakter."
          >
            <button
              type="button"
              className="toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </Field>

          <button className="btn" type="submit">
            Buat akun
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
