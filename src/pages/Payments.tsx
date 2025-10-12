import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { KPICard } from '@/components/KPICard';
import { CreditCard, Clock, CheckCircle } from 'lucide-react';
import { calculateDSO, calculatePaymentPercentage } from '@/lib/kpis';
import { Badge } from '@/components/ui/badge';

export default function Payments() {
  const { payments } = useAppStore();

  const dso = calculateDSO(payments);
  const within7Days = calculatePaymentPercentage(payments, 7);
  const within30Days = calculatePaymentPercentage(payments, 30);
  const pendingPayments = payments.filter(p => !p.paid_date);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pagos</h1>
        <p className="text-muted-foreground mt-1">
          Estado de pagos y cumplimiento de términos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="DSO Promedio"
          value={dso}
          unit="días"
          status={dso <= 30 ? 'success' : dso <= 45 ? 'warning' : 'danger'}
          icon={<Clock className="h-5 w-5" />}
        />
        <KPICard
          title="Pagos ≤ 7 días"
          value={within7Days}
          unit="%"
          status={within7Days >= 40 ? 'success' : within7Days >= 20 ? 'warning' : 'danger'}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <KPICard
          title="Pagos ≤ 30 días"
          value={within30Days}
          unit="%"
          status={within30Days >= 70 ? 'success' : within30Days >= 50 ? 'warning' : 'danger'}
          icon={<CreditCard className="h-5 w-5" />}
        />
      </div>

      <Card className="rounded-2xl shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Pagos Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingPayments.slice(0, 10).map((payment) => {
              const dueDate = new Date(payment.due_date);
              const today = new Date();
              const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysOverdue > 0;

              return (
                <div key={payment.invoice_id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{payment.invoice_id}</p>
                    <p className="font-medium text-foreground">${payment.amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-sm text-muted-foreground">Vence: {payment.due_date}</p>
                  </div>
                  <div className="text-right">
                    {isOverdue ? (
                      <Badge variant="destructive">Vencido ({daysOverdue} días)</Badge>
                    ) : (
                      <Badge variant="secondary">Pendiente</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
