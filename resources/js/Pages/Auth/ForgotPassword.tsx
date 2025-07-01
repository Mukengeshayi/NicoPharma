import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-green-50">
            <Head title="Mot de passe oublié" />
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
            <div className="flex flex-col justify-center md:w-1/2 px-6 py-1 sm:px-12 lg:px-16 ">
                <div className="mb-4 flex justify-center">
                    <img
                        src="/images/logo.svg"
                        alt="Logo Pharmacie"
                        className="h-32 w-auto"
                    />
                </div>
                <div className='mb-4 text-center'>
                    <h2 className="text-2xl font-bold text-gray-900">Mot de passe oublié?</h2>
                    <p className="text-md text-gray-600 text-center">Entrez votre adresse email pour recevoir un lien de réinitialisation du mot de passe.</p>
                </div>

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
                    <div className="flex items-center justify-start">

                            <a href="/login" className="text-md text-green-600 hover:underline">
                            Retour a la connexion
                            </a>
                    </div>
                    <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-green-700 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {processing ? 'Envoi en cours...' : 'Envoyez le lien'}
                    </button>
                </form>
            </div>
        </div>
    );
}
