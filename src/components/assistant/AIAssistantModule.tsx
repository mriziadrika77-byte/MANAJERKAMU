import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { AssistantMessage } from '@/types';
import {
  Bot,
  Send,
  Trash2,
  HelpCircle,
  ShieldCheck,
  User,
  ArrowRight,
} from 'lucide-react';

export const AIAssistantModule: React.FC = () => {
  const {
    activities,
    expenseTransactions,
    schedules,
    financialMetrics,
    user,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Halo ${user.name}! Saya Asisten Cerdas MANAJERKAMU. Saya menganalisis portofolio pekerjaan, arus kas masuk, pengeluaran, serta jadwal waktu Anda secara terintegrasi berdasarkan data lokal saat ini. Ada yang bisa saya bantu analisa?`,
      timestamp: 'Baru saja',
      insightCards: [
        {
          title: 'Total Net Income Saat Ini',
          value: formatCurrency(financialMetrics.netIncome),
          subtitle: `Margin Laba ~${financialMetrics.totalIncome > 0 ? Math.round((financialMetrics.netIncome / financialMetrics.totalIncome) * 100) : 0}%`,
          type: 'success',
        },
        {
          title: 'Pencapaian Target Bulanan',
          value: `${financialMetrics.targetAchievementRate}%`,
          subtitle: `Target: ${formatCurrency(user.monthlyTarget)}`,
          type: 'info',
        },
      ],
      suggestedFollowUps: [
        'Aktivitas mana yang paling menguntungkan?',
        'Berapa total pendapatan bersih saya?',
        'Apakah saya memiliki jadwal yang bertabrakan?',
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 4.B SUGGESTED QUESTIONS
  const suggestedQuestions = [
    'Aktivitas mana yang paling menguntungkan?',
    'Berapa total pendapatan bersih saya?',
    'Bagaimana kondisi pengeluaran bulan ini?',
    'Berapa target pendapatan yang belum tercapai?',
    'Aktivitas mana yang membutuhkan perhatian?',
    'Bagaimana distribusi waktu kerja saya?',
    'Apakah saya memiliki jadwal yang bertabrakan?',
    'Bagaimana cara meningkatkan pendapatan bersih?',
  ];

  // 4.C & 4.D AI ANALYSIS ENGINE (Pure Frontend Rule-Based Engine per PRD 6.8 & 4.C)
  const processQuery = (query: string): AssistantMessage => {
    const q = query.toLowerCase();
    const timestamp = 'Baru saja';

    // 1. Paling Menguntungkan
    if (q.includes('menguntungkan') || q.includes('profit') || q.includes('terbaik')) {
      const sortedByNet = [...activities].sort((a, b) => {
        const netA = a.actualIncome - a.actualExpense;
        const netB = b.actualIncome - b.actualExpense;
        return netB - netA;
      });
      const top = sortedByNet[0];
      const topNet = top ? top.actualIncome - top.actualExpense : 0;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Berdasarkan kalkulasi data riil, aktivitas yang paling menguntungkan saat ini adalah "${top?.name}". Aktivitas ini telah menghasilkan pendapatan kas ${formatCurrency(top?.actualIncome || 0)} dengan pengeluaran operasional ${formatCurrency(top?.actualExpense || 0)}, menghasilkan Laba Bersih tertinggi senilai ${formatCurrency(topNet)}.`,
        timestamp,
        insightCards: sortedByNet.slice(0, 3).map((act) => ({
          title: act.name,
          value: formatCurrency(act.actualIncome - act.actualExpense),
          subtitle: `Pendapatan: ${formatCurrency(act.actualIncome)} | Biaya: ${formatCurrency(act.actualExpense)}`,
          type: 'success',
        })),
        suggestedFollowUps: [
          'Bagaimana cara meningkatkan pendapatan bersih?',
          'Bagaimana kondisi pengeluaran bulan ini?',
        ],
      };
    }

    // 2. Total Pendapatan Bersih (Net Income)
    if (q.includes('pendapatan bersih') || q.includes('net income') || q.includes('laba')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Total pendapatan bersih (Net Income) Anda saat ini adalah ${formatCurrency(financialMetrics.netIncome)}. Nilai ini dihitung dari Total Kas Diterima (${formatCurrency(financialMetrics.totalIncome)}) dikurangi Seluruh Beban Pengeluaran Operasional (${formatCurrency(financialMetrics.totalExpense)}).`,
        timestamp,
        insightCards: [
          {
            title: 'Kas Diterima (Income)',
            value: formatCurrency(financialMetrics.totalIncome),
            subtitle: `${financialMetrics.paidCount} transaksi telah lunas dibayar`,
            type: 'info',
          },
          {
            title: 'Beban Biaya (Expense)',
            value: formatCurrency(financialMetrics.totalExpense),
            subtitle: `${expenseTransactions.length} transaksi pengeluaran tercatat`,
            type: 'warning',
          },
          {
            title: 'Pendapatan Bersih (Net)',
            value: formatCurrency(financialMetrics.netIncome),
            subtitle: `Margin laba bersih: ${financialMetrics.totalIncome > 0 ? Math.round((financialMetrics.netIncome / financialMetrics.totalIncome) * 100) : 0}%`,
            type: 'success',
          },
        ],
        suggestedFollowUps: [
          'Berapa target pendapatan yang belum tercapai?',
          'Aktivitas mana yang membutuhkan perhatian?',
        ],
      };
    }

    // 3. Kondisi Pengeluaran
    if (q.includes('pengeluaran') || q.includes('expense') || q.includes('biaya')) {
      const topExpense = [...expenseTransactions].sort((a, b) => b.amount - a.amount)[0];
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Total pengeluaran Anda periode ini adalah ${formatCurrency(financialMetrics.totalExpense)}. Pengeluaran tunggal terbesar saat ini adalah "${topExpense?.description}" senilai ${formatCurrency(topExpense?.amount || 0)} (${topExpense?.category}). Secara umum, pengeluaran Anda terkendali di bawah 12% dari total pendapatan masuk.`,
        timestamp,
        insightCards: [
          {
            title: 'Total Pengeluaran',
            value: formatCurrency(financialMetrics.totalExpense),
            subtitle: 'Operasional, langganan & logistik',
            type: 'warning',
          },
          {
            title: 'Pengeluaran Terbesar',
            value: formatCurrency(topExpense?.amount || 0),
            subtitle: topExpense?.description || 'N/A',
            type: 'info',
          },
        ],
        suggestedFollowUps: [
          'Bagaimana cara meningkatkan pendapatan bersih?',
          'Aktivitas mana yang paling menguntungkan?',
        ],
      };
    }

    // 4. Target Pendapatan Belum Tercapai
    if (q.includes('target') || q.includes('kurang') || q.includes('sisa')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Target pendapatan bulanan Anda adalah ${formatCurrency(user.monthlyTarget)}. Saat ini Anda telah merealisasikan ${formatCurrency(financialMetrics.totalIncome)} (${financialMetrics.targetAchievementRate}%). Sisa kekurangan target yang harus dipenuhi adalah ${formatCurrency(financialMetrics.remainingTarget)}. Di sisi lain, Anda memiliki tagihan pending senilai ${formatCurrency(financialMetrics.outstandingPayments)} yang berpotensi langsung menutup kekurangan ini jika segera dicairkan.`,
        timestamp,
        insightCards: [
          {
            title: 'Kekurangan Target',
            value: formatCurrency(financialMetrics.remainingTarget),
            subtitle: `Target bulanan: ${formatCurrency(user.monthlyTarget)}`,
            type: 'warning',
          },
          {
            title: 'Invoice Belum Cair',
            value: formatCurrency(financialMetrics.outstandingPayments),
            subtitle: `${financialMetrics.pendingCount + financialMetrics.partiallyPaidCount} invoice siap ditagihkan`,
            type: 'info',
          },
        ],
        suggestedFollowUps: [
          'Aktivitas mana yang membutuhkan perhatian?',
          'Apakah saya memiliki jadwal yang bertabrakan?',
        ],
      };
    }

    // 5. Jadwal Bertabrakan (Conflict)
    if (q.includes('tabrak') || q.includes('benturan') || q.includes('jadwal') || q.includes('waktu')) {
      const conflicts = schedules.filter((s) => s.isConflict);
      if (conflicts.length > 0) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `Perhatian: Terdeteksi ${conflicts.length} benturan jadwal kerja! Pada tanggal 12 Nov, jadwal "Packing & Kurir Kopi Drip" (16:00 - 17:30) bertabrakan dengan "Armada Sore Peak Hour Delivery" (17:00 - 19:30). Kami menyarankan untuk memajukan sesi packing menjadi pukul 14:30 agar tidak mengganggu rute pengantaran logistik sore hari.`,
          timestamp,
          insightCards: conflicts.map((c) => ({
            title: c.title,
            value: `${c.startTime} - ${c.endTime} WIB`,
            subtitle: `Aktivitas: ${c.activityName}`,
            type: 'warning',
          })),
          suggestedFollowUps: [
            'Bagaimana distribusi waktu kerja saya?',
            'Aktivitas mana yang membutuhkan perhatian?',
          ],
        };
      }
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: 'Kabar baik! Seluruh jadwal kerja dan agenda Anda saat ini terkelola rapi tanpa ada benturan waktu.',
        timestamp,
        insightCards: [
          {
            title: 'Status Kalender',
            value: 'Optimal (Bebas Benturan)',
            subtitle: `${schedules.length} jadwal terdaftar aman`,
            type: 'success',
          },
        ],
        suggestedFollowUps: ['Bagaimana distribusi waktu kerja saya?'],
      };
    }

    // 6. Distribusi Waktu Kerja
    if (q.includes('distribusi') || q.includes('jam kerja') || q.includes('beban')) {
      const totalHours = schedules.reduce((sum, s) => sum + s.durationHours, 0) || 38.5;
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Total durasi kerja Anda tercatat ${totalHours} jam dari kapasitas aman 45 jam per minggu (utilisasi ~${Math.round((totalHours / 45) * 100)}%). Jam kerja terpanjang dihabiskan pada platform logistik (GoDrive & Grab) dan pengerjaan modul FinTech. Alokasi ini masih berada dalam ambang batas produktif sehat.`,
        timestamp,
        insightCards: [
          {
            title: 'Total Jam Kerja',
            value: `${totalHours} Jam`,
            subtitle: 'Batas mingguan: 45 Jam',
            type: 'info',
          },
          {
            title: 'Revenue per Jam Kerja',
            value: formatCurrency(financialMetrics.revenuePerHour),
            subtitle: 'Efisiensi konversi waktu ke pendapatan',
            type: 'success',
          },
        ],
        suggestedFollowUps: [
          'Aktivitas mana yang paling menguntungkan?',
          'Bagaimana cara meningkatkan pendapatan bersih?',
        ],
      };
    }

    // 7. Cara Meningkatkan Pendapatan Bersih
    if (q.includes('tingkatkan') || q.includes('meningkatkan') || q.includes('saran') || q.includes('rekomendasi')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Berdasarkan analisis portofolio Anda, berikut 3 rekomendasi praktis untuk melipatgandakan Laba Bersih:
1. **Follow-up Invoice Pending Segera**: Tagihkan termin kedua Bank Ventura senilai Rp 7.500.000 yang jatuh tempo dalam beberapa hari ke depan.
2. **Ekspansi Sesi Kursus IELTS**: Sesi mentoring memiliki margin laba bersih tertinggi (96%) dengan biaya operasional minimal. Menambah 2 peserta baru dapat menambah Rp 2.400.000 kas bersih per bulan.
3. **Optimasi Rute Armada**: Pengeluaran bahan bakar mencapai Rp 450.000/minggu. Memfokuskan pengantaran hanya pada jam peak-hour berbonus tinggi akan meningkatkan rasio revenue per working hour Anda.`,
        timestamp,
        insightCards: [
          {
            title: 'Potensi Kas Tertagih',
            value: formatCurrency(financialMetrics.outstandingPayments),
            subtitle: 'Invoice termin siap cair',
            type: 'info',
          },
          {
            title: 'Margin Tertinggi',
            value: 'IELTS Mentoring (~96%)',
            subtitle: 'Rekomendasi prioritas ekspansi',
            type: 'success',
          },
        ],
        suggestedFollowUps: [
          'Aktivitas mana yang paling menguntungkan?',
          'Berapa total pendapatan bersih saya?',
        ],
      };
    }

    // 8. Aktivitas yang membutuhkan perhatian
    if (q.includes('perhatian') || q.includes('evaluasi') || q.includes('kurang')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Aktivitas yang paling membutuhkan perhatian Anda saat ini adalah "Toko Kopi Drip & Merch Online". Meskipun menghasilkan omset Rp 8.650.000, biaya operasionalnya mencapai Rp 3.450.000 (biaya kemasan dan iklan), sehingga margin labanya berada di 40%. Disarankan mengevaluasi pembelian pouch kopi dalam jumlah partai besar untuk menekan harga pokok produksi.`,
        timestamp,
        insightCards: [
          {
            title: 'Aktivitas Evaluasi',
            value: 'Toko Kopi Online',
            subtitle: 'Biaya operasional: Rp 3.450.000',
            type: 'warning',
          },
          {
            title: 'Rekomendasi Tindakan',
            value: 'Efisiensi Packaging Pouch',
            subtitle: 'Beli grosir untuk meningkatkan margin',
            type: 'info',
          },
        ],
        suggestedFollowUps: [
          'Bagaimana cara meningkatkan pendapatan bersih?',
          'Aktivitas mana yang paling menguntungkan?',
        ],
      };
    }

    // Fallback sopan jika query tidak terdeteksi
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `Pertanyaan Anda menarik! Sebagai asisten analisis prototipe lokal, saya diprogram untuk menganalisis data keuangan, portofolio pekerjaan, perbandingan profitabilitas, jadwal kerja, dan target pendapatan Anda. Anda dapat mencoba menanyakan topik tersebut atau mengklik salah satu contoh pertanyaan di bawah ini.`,
      timestamp,
      suggestedFollowUps: [
        'Aktivitas mana yang paling menguntungkan?',
        'Berapa total pendapatan bersih saya?',
        'Apakah saya memiliki jadwal yang bertabrakan?',
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Simulated short delay for natural SaaS assistant feel
    setTimeout(() => {
      const response = processQuery(text);
      setMessages((prev) => [...prev, response]);
    }, 400);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'msg-cleared',
        sender: 'assistant',
        text: 'Riwayat percakapan telah dibersihkan. Silakan ajukan pertanyaan atau pilih rekomendasi analisis di bawah.',
        timestamp: 'Baru saja',
        suggestedFollowUps: [
          'Aktivitas mana yang paling menguntungkan?',
          'Berapa total pendapatan bersih saya?',
        ],
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <PageHeader
        title="AI Personal Assistant"
        description="Asisten cerdas analisis aktivitas ekonomi, diagnosis kesehatan arus kas, perbandingan profitabilitas, dan rekomendasi waktu berbasis data lokal."
        breadcrumb={<span>Intelligence / AI Assistant</span>}
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4 text-content-muted" />}
            onClick={handleClearChat}
          >
            Bersihkan Chat
          </Button>
        }
      />

      {/* 4.G AI Transparency Banner */}
      <div className="p-3.5 rounded-xl bg-brand-mist/60 dark:bg-brand-tint border border-brand-soft/40 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-4 h-4 text-brand-navy dark:text-brand-blue shrink-0 mt-0.5" />
        <p className="text-content-secondary leading-relaxed">
          <span className="font-bold text-brand-navy dark:text-brand-blue">Transparansi Prototipe:</span>{' '}
          AI Assistant menggunakan analisis berbasis data lokal dan simulasi logika terpadu (Rule-based Engine). Seluruh rekomendasi ditujukan untuk eksplorasi prototipe dan bukan nasihat keuangan profesional berlisensi.
        </p>
      </div>

      {/* CHAT CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left: Chat Conversation Area (3 cols) */}
        <Card className="lg:col-span-3 flex flex-col h-[600px] p-0 overflow-hidden border-border">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-surface-elevated/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-navy dark:bg-brand-blue flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-content-primary">
                  ManajerKamu Assistant
                </h3>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Terhubung ke Data Lokal
                </span>
              </div>
            </div>

            <Badge variant="default" size="sm">
              Model: Local Analytics Engine v3.1
            </Badge>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-brand-navy text-white dark:bg-brand-blue'
                      : 'bg-brand-mist dark:bg-brand-tint text-brand-navy dark:text-brand-blue'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg rounded-tr-none'
                        : 'bg-surface-elevated border border-border text-content-primary rounded-tl-none shadow-subtle'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`text-[10px] mt-2 block ${
                        msg.sender === 'user' ? 'text-white/70' : 'text-content-muted'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Insight Cards Embedded in Message */}
                  {msg.insightCards && msg.insightCards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {msg.insightCards.map((card, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-surface border border-border shadow-subtle text-xs space-y-1"
                        >
                          <span className="text-[11px] text-content-muted block">{card.title}</span>
                          <span
                            className={`font-mono text-sm font-bold block ${
                              card.type === 'success'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : card.type === 'warning'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-brand-navy dark:text-brand-blue'
                            }`}
                          >
                            {card.value}
                          </span>
                          {card.subtitle && (
                            <span className="text-[10px] text-content-secondary block">{card.subtitle}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested follow-up chips */}
                  {msg.suggestedFollowUps && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowUps.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-brand-mist dark:bg-surface-elevated border border-brand-soft/40 text-brand-navy dark:text-brand-blue hover:opacity-80 transition-opacity font-medium"
                        >
                          {q} &rarr;
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <div className="p-3 sm:p-4 border-t border-border bg-surface">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Tanyakan analisis pemasukan, margin aktivitas, atau jadwal..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-surface text-content-primary text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
              />
              <Button variant="primary" size="md" type="submit" disabled={!inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Right: 4.B Quick Questions Library (1 col) */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-2.5">
            <HelpCircle className="w-4 h-4 text-brand-blue" />
            <h4 className="font-heading text-sm font-bold text-content-primary">
              Rekomendasi Pertanyaan
            </h4>
          </div>
          <p className="text-xs text-content-muted leading-relaxed">
            Klik pertanyaan cepat di bawah untuk langsung menguji fungsi analisis data:
          </p>

          <div className="space-y-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="w-full text-left p-2.5 rounded-xl border border-border bg-surface-elevated/40 hover:bg-brand-mist/50 dark:hover:bg-brand-tint hover:border-brand-soft text-xs text-content-primary transition-all duration-150 flex items-center justify-between group"
              >
                <span className="group-hover:text-brand-blue transition-colors">{q}</span>
                <ArrowRight className="w-3.5 h-3.5 text-content-muted group-hover:translate-x-1 group-hover:text-brand-blue transition-transform shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

