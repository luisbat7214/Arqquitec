import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  Check,
  X,
} from "lucide-react";

export default function FormularioRegistro() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
    fechaNacimiento: "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es requerido";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nuevosErrores.email = "El email es requerido";
    } else if (!emailRegex.test(formData.email)) {
      nuevosErrores.email = "Email inválido";
    } else if (usuarios.some((u) => u.email === formData.email)) {
      nuevosErrores.email = "Este email ya está registrado";
    }

    const telefonoRegex = /^[0-9]{10}$/;
    if (formData.telefono && !telefonoRegex.test(formData.telefono)) {
      nuevosErrores.telefono = "Teléfono debe tener 10 dígitos";
    }

    if (!formData.password) {
      nuevosErrores.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      nuevosErrores.password = "Mínimo 6 caracteres";
    }

    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = "Las contraseñas no coinciden";
    }

    if (!formData.fechaNacimiento) {
      nuevosErrores.fechaNacimiento = "La fecha de nacimiento es requerida";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      // NOTA: En producción, aquí harías una petición POST a tu API
      // Ejemplo:
      // fetch('/api/usuarios', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      const nuevoUsuario = {
        id: Date.now(),
        ...formData,
        fechaRegistro: new Date().toLocaleString(),
        password: "••••••••", // No mostrar contraseña real
      };

      setUsuarios((prev) => [...prev, nuevoUsuario]);

      setMensaje({
        tipo: "exito",
        texto: "¡Usuario registrado exitosamente!",
      });

      // Limpiar formulario
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        password: "",
        confirmarPassword: "",
        fechaNacimiento: "",
      });

      setTimeout(() => setMensaje(null), 3000);
    } else {
      setMensaje({
        tipo: "error",
        texto: "Por favor corrige los errores en el formulario",
      });
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sistema de Registro
          </h1>
          <p className="text-gray-600">
            Crea tu cuenta para acceder a la plataforma
          </p>
        </div>

        {/* Mensaje de éxito/error */}
        {mensaje && (
          <div
            className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg flex items-center gap-3 ${
              mensaje.tipo === "exito"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {mensaje.tipo === "exito" ? <Check size={20} /> : <X size={20} />}
            {mensaje.texto}
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex gap-4 mb-6 max-w-2xl mx-auto">
          <button
            onClick={() => setMostrarFormulario(true)}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              mostrarFormulario
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Nuevo Registro
          </button>
          <button
            onClick={() => setMostrarFormulario(false)}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
              !mostrarFormulario
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Ver Usuarios ({usuarios.length})
          </button>
        </div>

        {mostrarFormulario ? (
          /* Formulario de Registro */
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <UserPlus className="text-blue-600" size={32} />
              <h2 className="text-2xl font-bold text-gray-800">
                Formulario de Registro
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Juan"
                  />
                  {errores.nombre && (
                    <p className="text-red-500 text-sm mt-1">
                      {errores.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.apellido ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Pérez"
                  />
                  {errores.apellido && (
                    <p className="text-red-500 text-sm mt-1">
                      {errores.apellido}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errores.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ejemplo@correo.com"
                />
                {errores.email && (
                  <p className="text-red-500 text-sm mt-1">{errores.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errores.telefono ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="3001234567"
                />
                {errores.telefono && (
                  <p className="text-red-500 text-sm mt-1">
                    {errores.telefono}
                  </p>
                )}
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Fecha de Nacimiento *
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errores.fechaNacimiento
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errores.fechaNacimiento && (
                  <p className="text-red-500 text-sm mt-1">
                    {errores.fechaNacimiento}
                  </p>
                )}
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-1" />
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errores.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errores.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-1" />
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    name="confirmarPassword"
                    value={formData.confirmarPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errores.confirmarPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Repite tu contraseña"
                  />
                  {errores.confirmarPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errores.confirmarPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
              >
                Registrar Usuario
              </button>
            </form>
          </div>
        ) : (
          /* Tabla de Usuarios Registrados */
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Usuarios Registrados
            </h2>

            {usuarios.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay usuarios registrados aún</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Nombre
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Teléfono
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Fecha Nacimiento
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Fecha Registro
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          {usuario.nombre} {usuario.apellido}
                        </td>
                        <td className="px-4 py-3 text-sm">{usuario.email}</td>
                        <td className="px-4 py-3 text-sm">
                          {usuario.telefono || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {usuario.fechaNacimiento}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {usuario.fechaRegistro}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Nota informativa */}
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Esta es una demostración. Los datos se
            almacenan temporalmente en memoria y se perderán al recargar la
            página. Para uso real, necesitas conectar este formulario a un
            backend con base de datos (MySQL, PostgreSQL, MongoDB, etc.).
          </p>
        </div>
      </div>
    </div>
  );
}
