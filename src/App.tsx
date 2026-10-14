import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { domAnimation, LazyMotion } from 'framer-motion';
import { AccountLayout } from './components/layout/AccountLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { PublicLayout } from './components/layout/PublicLayout';
import { RequireAuth } from './components/layout/RequireAuth';
import { RouteFallback } from './components/layout/RouteFallback';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { BookingDraftProvider } from './contexts/BookingDraftContext';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import { HomePage } from './pages/Home';
import { AR_PREFIX } from './utils/localeRoute';
import { queryClient } from './utils/queryClient';

const named = <T extends Record<string, React.ComponentType>,>(loader: () => Promise<T>, key: keyof T) =>
lazy(() => loader().then((m) => ({ default: m[key] })));

const ServicesPage = named(() => import('./pages/Services'), 'ServicesPage');
const ServiceDetailPage = named(() => import('./pages/ServiceDetail'), 'ServiceDetailPage');
const NursesPage = named(() => import('./pages/Nurses'), 'NursesPage');
const NurseProfilePage = named(() => import('./pages/NurseProfile'), 'NurseProfilePage');
const HowItWorksPage = named(() => import('./pages/HowItWorks'), 'HowItWorksPage');
const AboutPage = named(() => import('./pages/About'), 'AboutPage');
const WhyCareFlowPage = named(() => import('./pages/WhyCareFlow'), 'WhyCareFlowPage');
const StoriesPage = named(() => import('./pages/Stories'), 'StoriesPage');
const FaqsPage = named(() => import('./pages/Faqs'), 'FaqsPage');
const ContactPage = named(() => import('./pages/Contact'), 'ContactPage');
const ResourcesPage = named(() => import('./pages/Resources'), 'ResourcesPage');
const ResourceArticlePage = named(() => import('./pages/ResourceArticle'), 'ResourceArticlePage');
const LegalPage = named(() => import('./pages/Legal'), 'LegalPage');
const NotFoundPage = named(() => import('./pages/NotFound'), 'NotFoundPage');
const NewsletterTokenPage = lazy(() => import('./pages/NewsletterToken').then((m) => ({ default: m.NewsletterTokenPage })));
const BookPage = named(() => import('./pages/booking/Book'), 'BookPage');
const CheckoutPage = named(() => import('./pages/booking/Checkout'), 'CheckoutPage');
const SignInPage = named(() => import('./pages/auth/SignIn'), 'SignInPage');
const SignUpPage = named(() => import('./pages/auth/SignUp'), 'SignUpPage');
const ForgotPasswordPage = named(() => import('./pages/auth/ForgotPassword'), 'ForgotPasswordPage');
const DashboardPage = named(() => import('./pages/account/Dashboard'), 'DashboardPage');
const BookingsPage = named(() => import('./pages/account/Bookings'), 'BookingsPage');
const BookingDetailPage = named(() => import('./pages/account/BookingDetail'), 'BookingDetailPage');
const ProfilePage = named(() => import('./pages/account/Profile'), 'ProfilePage');

/**
 * Arabic pages run under `basename="/ar"`. Switching language changes the URL in place (I18nContext) and remounts the
 * router with the new basename — no page reload; auth, booking draft and the query cache (outside) are kept.
 */
function LocaleRouter({ children }: {children: React.ReactNode;}) {
  const { locale } = useI18n();
  return (
    <BrowserRouter key={locale} basename={locale === 'ar' ? AR_PREFIX : undefined}>
      {children}
    </BrowserRouter>);

}

export function App() {
  return (
    <ErrorBoundary>
      {/* Only the DOM animation features (no layout/drag): keeps framer-motion small in the entry bundle. */}
      <LazyMotion features={domAnimation} strict>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <AuthProvider>
            <BookingDraftProvider>
              <LocaleRouter>
                <ScrollToTop />
                <Suspense fallback={<RouteFallback />}>
                  <Routes>
                    <Route element={<PublicLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="services" element={<ServicesPage />} />
                      <Route path="services/:slug" element={<ServiceDetailPage />} />
                      <Route path="nurses" element={<NursesPage />} />
                      <Route path="nurses/:slug" element={<NurseProfilePage />} />
                      <Route path="how-it-works" element={<HowItWorksPage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="why-careflow" element={<WhyCareFlowPage />} />
                      <Route path="stories" element={<StoriesPage />} />
                      <Route path="faqs" element={<FaqsPage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="resources" element={<ResourcesPage />} />
                      <Route path="resources/:slug" element={<ResourceArticlePage />} />
                      <Route path="legal/:doc" element={<LegalPage />} />
                      <Route path="newsletter/confirm" element={<NewsletterTokenPage mode="confirm" />} />
                      <Route path="newsletter/unsubscribe" element={<NewsletterTokenPage mode="unsubscribe" />} />
                      <Route path="book" element={<BookPage />} />
                      <Route
                        path="checkout/:bookingId"
                        element={
                        <RequireAuth>
                            <CheckoutPage />
                          </RequireAuth>
                        } />
                      
                      <Route path="*" element={<NotFoundPage />} />
                    </Route>
                    <Route element={<AuthLayout />}>
                      <Route path="sign-in" element={<SignInPage />} />
                      <Route path="sign-up" element={<SignUpPage />} />
                      <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    </Route>
                    <Route
                      path="account"
                      element={
                      <RequireAuth>
                          <AccountLayout />
                        </RequireAuth>
                      }>
                      
                      <Route index element={<DashboardPage />} />
                      <Route path="bookings" element={<BookingsPage />} />
                      <Route path="bookings/:id" element={<BookingDetailPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                    </Route>
                  </Routes>
                </Suspense>
              </LocaleRouter>
            </BookingDraftProvider>
          </AuthProvider>
        </I18nProvider>
      </QueryClientProvider>
      </LazyMotion>
    </ErrorBoundary>);

}