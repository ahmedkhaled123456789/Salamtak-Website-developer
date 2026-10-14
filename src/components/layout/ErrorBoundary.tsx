import React from 'react';

interface State {
  hasError: boolean;
}

/** Catches render errors so one broken section never blanks the whole site. */
export class ErrorBoundary extends React.Component<{children: React.ReactNode;}, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('CareFlow render error', error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div role="alert" className="flex min-h-screen w-full items-center justify-center bg-ivory px-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-4xl text-ink">Something went wrong · حدث خطأ ما</h1>
          <p className="mt-3 text-muted">Please reload the page. · يُرجى إعادة تحميل الصفحة.</p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="mt-8 inline-flex h-11 items-center rounded-full bg-brand px-6 font-semibold text-white hover:bg-brand-dark">
            
            Home · الرئيسية
          </button>
        </div>
      </div>);

  }
}