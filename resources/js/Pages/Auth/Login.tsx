import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
            <div className="min-h-screen flex flex-col md:flex-row bg-green-50">
                <Head title="Connexion" />
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-green-700 to-to-emerald-100 items-center justify-center p-10">
                    <img
                        src="/images/sign_up.png"
                        alt="Pharmacy branding"
                        className="rounded-lg shadow-lg max-w-full max-h-full object-cover"
                    />
                </div>
                <div className="flex flex-col justify-center md:w-1/2 px-6 py-2 sm:px-12 lg:px-16 ">
                    <div className="mb-4 flex justify-center">
                        <img
                            src="/images/logo.svg"
                            alt="Logo Pharmacie"
                            className="h-32 w-auto"
                        />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Connexion à votre espace
                    </h2>
                    <form onSubmit={submit} className="space-y-6" noValidate>
                        <div>
                            <label htmlFor="email" className="block text-md font-medium text-gray-700">Adresse email</label>
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
                            <label htmlFor="password" className="block text-md font-medium text-gray-700">Mot de passe</label>
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
                                    autoComplete="current-password"
                                />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-6 w-6 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-md text-gray-600">Se souvenir de moi</span>
                            </label>

                            <a href="/forgot-password" className="text-md text-green-600 hover:underline">
                            Mot de passe oublié ?
                            </a>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {processing ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Vous avez un probleme?
                        <a href="" className="ml-1 text-green-700 hover:underline">Contactez l'administrateur</a>
                    </p>
                </div>
            </div>
    );
}

