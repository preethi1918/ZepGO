import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageTitle, PageSubtitle } from '../components/ui/PageTitle';

interface PlaceholderPageProps {
  title: string;
  description: string;
  phase?: string;
  icon?: React.ReactNode;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  phase = 'Phase 4+',
  icon
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" icon={<Clock className="w-3.5 h-3.5" />}>
              {phase} Placeholder
            </Badge>
          </div>
          <PageTitle gradient>{title}</PageTitle>
          <PageSubtitle>{description}</PageSubtitle>
        </div>

        <Button
          variant="secondary"
          onClick={() => navigate('/home')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Main Card */}
      <Card variant="solid" className="p-8 text-center space-y-4 max-w-xl mx-auto border-emerald-200">
        <div className="p-4 bg-emerald-100 rounded-2xl w-fit mx-auto text-emerald-700 border border-emerald-200">
          {icon || <Sparkles className="w-8 h-8" />}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900">{title} Engine</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            This section is part of upcoming application roadmap ({phase}). In Phase 3, you can explore the main ZepGO EV Dashboard.
          </p>
        </div>

        <div className="pt-2">
          <Button variant="primary" onClick={() => navigate('/home')}>
            Return to Main Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
};
