'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  BookOpen,
  Database,
  Shield,
  Zap,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function AboutChatbotPage() {
  const scopeItems = [
    {
      icon: BookOpen,
      title: 'Informasi Akademik',
      items: [
        'Profil program studi',
        'Visi dan misi kampus',
        'Peraturan akademik',
        'Kode etik mahasiswa',
        'Pedoman PKL',
        'Pedoman Tugas Akhir/Skripsi',
        'Buku Pedoman Penulisan Karya Ilmiah',
      ],
    },
    {
      icon: Zap,
      title: 'Layanan Khusus',
      items: [
        'Informasi layanan PINTU',
        'Teaching Factory (TEFA)',
        'Informasi dosen Jurusan Teknologi Informasi',
      ],
    },
  ];

  const sourceItems = [
    { name: 'polije.ac.id', icon: Database },
    { name: 'jti.polije.ac.id', icon: BookOpen },
    { name: 'pintu.polije.ac.id', icon: Target },
    { name: 'jtinova.com', icon: Zap },
    { name: 'sim-online.polije.ac.id', icon: Shield },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='min-h-screen bg-gradient-to-br from-background to-secondary/20 py-4 md:py-12 px-2 md:px-4'
    >
      <div className='container mx-auto max-w-4xl px-1 md:px-0'>
        <motion.div variants={itemVariants}>
          <Link
            href='/'
            className='inline-flex items-center text-primary hover:text-primary/80 mb-4 md:mb-6 px-2 md:px-0'
          >
            <ArrowLeft className='mr-2 h-4 w-4' /> Kembali ke Beranda
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className='px-1 md:px-0'>
          <Card className='overflow-hidden w-full'>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
              className='bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 md:p-8 text-center'
            >
              <h1 className='text-2xl md:text-4xl font-extrabold mb-2 md:mb-4 tracking-tight'>
                JEMPOL Chatbot
              </h1>
              <p className='text-sm md:text-xl opacity-90 max-w-2xl mx-auto'>
                Jaringan Edukasi dan Informasi Layanan Mandiri POLIJE - Asisten
                Pintar untuk Informasi Akademik
              </p>
            </motion.div>

            {/* Scope of Knowledge */}
            <CardContent className='p-4 md:p-8'>
              <CardHeader className='px-0'>
                <CardTitle className='text-xl md:text-2xl font-bold flex items-center'>
                  <Target className='mr-4 text-primary' size={24} />
                  Ruang Lingkup Pengetahuan
                </CardTitle>
              </CardHeader>

              <motion.div
                variants={containerVariants}
                className='grid md:grid-cols-2 gap-4 md:gap-6'
              >
                {scopeItems.map((section, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Card className='overflow-hidden'>
                      <CardHeader className='bg-muted p-3 md:p-4'>
                        <CardTitle className='text-base md:text-xl font-semibold flex items-center'>
                          <section.icon
                            className='mr-3 text-primary'
                            size={20}
                          />
                          {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='pt-3 md:pt-4'>
                        <motion.ul
                          variants={containerVariants}
                          initial='hidden'
                          animate='visible'
                          className='space-y-1 md:space-y-2'
                        >
                          {section.items.map((item, itemIndex) => (
                            <motion.li
                              key={itemIndex}
                              variants={itemVariants}
                              className='flex items-center text-xs md:text-sm'
                            >
                              <CheckCircle
                                className='mr-2 text-primary'
                                size={14}
                              />
                              {item}
                            </motion.li>
                          ))}
                        </motion.ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>

            {/* Information Sources */}
            <CardContent className='bg-muted/50 p-8'>
              <CardHeader className='px-0'>
                <CardTitle className='text-2xl font-bold flex items-center'>
                  <Database className='mr-4 text-primary' size={24} />
                  Sumber Informasi
                </CardTitle>
              </CardHeader>

              <motion.div
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                className='flex flex-wrap gap-4'
              >
                {sourceItems.map((source, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <Badge variant='secondary' className='text-sm py-2 px-3'>
                      <source.icon className='mr-2 h-4 w-4' />
                      {source.name}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>

            {/* Limitations */}
            <CardContent className='p-8'>
              <CardHeader className='px-0'>
                <CardTitle className='text-2xl font-bold flex items-center'>
                  <Shield className='mr-4 text-primary' size={24} />
                  Batasan dan Pengecualian
                </CardTitle>
              </CardHeader>

              <Card>
                <CardContent className='pt-6'>
                  <motion.ul
                    variants={containerVariants}
                    initial='hidden'
                    animate='visible'
                    className='space-y-3'
                  >
                    {[
                      'Informasi dapat berubah sewaktu-waktu',
                      'Verifikasi resmi tetap memerlukan konfirmasi langsung',
                      'Tidak dapat melakukan transaksi atau perubahan data',
                      'Tidak menyediakan informasi pribadi rahasia',
                      'Kemampuan terbatas pada data yang telah dilatih',
                    ].map((limitation, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className='flex items-center text-sm'
                      >
                        <Info className='mr-3 text-primary' size={16} />
                        {limitation}
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
            </CardContent>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className='bg-muted p-4 text-center'
            >
              <p className='text-sm text-muted-foreground'>
                JEMPOL Chatbot - Versi 3.4.1 (Prototype)
                <br />
                Terakhir Diperbarui: Februari 2025
              </p>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
