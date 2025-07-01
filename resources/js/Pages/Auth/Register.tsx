import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="">
            <Head title="Register" />
            <div className="min-h-screen flex flex-col md:flex-row bg-green-50">
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-green-700 to-to-emerald-100 items-center justify-center p-10">
                    <img
                        src="/images/sign_up.png"
                        alt="Pharmacy branding"
                        className="rounded-lg shadow-lg max-w-full max-h-full object-cover"
                    />
                </div>
                <div className="flex flex-col justify-center md:w-1/2 px-6 py-1 sm:px-12 lg:px-16">
                    <div className="mb-4 flex justify-center">
                        <img
                            src="/images/logo.svg"
                            alt="Logo Pharmacie"
                            className="h-32 w-auto"
                        />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Créer un compte administrateur</h2>
                    <form onSubmit={submit} className="space-y-6" noValidate>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`mt-1 block w-full rounded-md border-green-600 shadow-sm focus:ring-green-500 focus:border-green-500 ${
                                    errors.name ? 'border-red-500' : ''
                                }`}
                                required
                                autoComplete="name"
                                autoFocus
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`mt-1 block w-full rounded-md border-green-600 shadow-sm focus:ring-green-500 focus:border-green-500 ${
                                    errors.email ? 'border-red-500' : ''
                                }`}
                                required
                                autoComplete="email"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className={`mt-1 block w-full rounded-md border-green-600 shadow-sm focus:ring-green-500 focus:border-green-500 ${
                                    errors.password ? 'border-red-500' : ''
                                }`}
                                required
                                autoComplete="new-password"
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full rounded-md border-green-600 shadow-sm focus:ring-green-500 focus:border-green-500"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-700 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {processing ? 'Création en cours...' : 'Créer le compte'}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}
