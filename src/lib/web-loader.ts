import { PuppeteerWebBaseLoader } from '@langchain/community/document_loaders/web/puppeteer';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import fs from 'fs/promises';
import path from 'path';

class WebScraper {
  private urls: string[];
  private outputDir: string;
  private maxDepth: number;
  private timeout: number;
  private retries: number;
  private delayBetweenRequests: number;

  constructor(options: {
    urls: string[];
    outputDir?: string;
    maxDepth?: number;
    timeout?: number;
    retries?: number;
    delayBetweenRequests?: number;
  }) {
    this.urls = options.urls;
    this.outputDir = options.outputDir || './scraped_docs';
    this.maxDepth = options.maxDepth || 3;
    this.timeout = options.timeout || 60000;
    this.retries = options.retries || 2; 
    this.delayBetweenRequests = options.delayBetweenRequests || 1000;
  }

  private async createOutputDir() {
    await fs.mkdir(this.outputDir, { recursive: true });
  }

  private sanitizeFileName(url: string): string {
    return (
      url
        .replace(/^https?:\/\//, '')
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase()
        .substring(0, 255) + '.txt'
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async scrapeWithRetry(
    url: string,
    retryCount = 0,
  ): Promise<Document[]> {
    try {
      const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        gotoOptions: {
          waitUntil: 'domcontentloaded',
          timeout: this.timeout,
        },
        evaluate: async (page) => {
          const contentSelectors = [
            'main',
            'article',
            '.content',
            '#content',
            '.page-content',
            'body',
          ];

          return await page.evaluate((selectors: string[]): string => {
            for (const selector of selectors) {
              const contentElement: Element | null =
                document.querySelector(selector);
              if (contentElement) {
                const elementsToRemove: NodeListOf<Element> =
                  contentElement.querySelectorAll(
                    'script, style, nav, header, footer, aside',
                  );
                elementsToRemove.forEach((el: Element): void => el.remove());

                return contentElement.textContent?.trim() || '';
              }
            }
            return document.body.textContent?.trim() || '';
          }, contentSelectors);
        },
      });

      const docs = await loader.load();

      const enhancedDocs = docs.map((doc) => {
        return new Document({
          pageContent: doc.pageContent,
          metadata: {
            ...doc.metadata,
            source_type: 'web_scraped',
            scraped_at: new Date().toISOString(),
            url: url,
          },
        });
      });

      return enhancedDocs;
    } catch (error) {
      if (retryCount < this.retries) {
        console.log(`Retry ${retryCount + 1}/${this.retries} for ${url}`);
        await this.delay((retryCount + 1) * 2000);
        return this.scrapeWithRetry(url, retryCount + 1);
      }

      console.error(
        `Failed to scrape ${url} after ${this.retries} retries:`,
        error,
      );
      return [];
    }
  }

  public async scrapeUrls(): Promise<Document[]> {
    await this.createOutputDir();
    const allDocuments: Document[] = [];

    for (const url of this.urls) {
      try {
        console.log(`Scraping: ${url}`);
        const enhancedDocs = await this.scrapeWithRetry(url);

        if (enhancedDocs.length > 0) {
          const filename = path.join(
            this.outputDir,
            this.sanitizeFileName(url),
          );
          await fs.writeFile(filename, enhancedDocs[0].pageContent);
          allDocuments.push(...enhancedDocs);
        }

        await this.delay(this.delayBetweenRequests);
      } catch (error) {
        console.error(`Error processing ${url}:`, error);
      }
    }

    return allDocuments;
  }

  public async processScrapedDocuments(
    documents: Document[],
  ): Promise<Document[]> {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      lengthFunction: (text) => text.length,
      separators: ['\n\n', '\n', '. ', '? ', '! ', '; ', ': ', ' - ', ', '],
    });

    const chunkedDocs = await textSplitter.splitDocuments(documents);

    const cleanedChunks = chunkedDocs.map((doc) => ({
      ...doc,
      pageContent: doc.pageContent
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
      metadata: {
        ...doc.metadata,
        source_type: 'web_scraped',
        processed_at: new Date().toISOString(),
      },
    }));

    return cleanedChunks;
  }
}

export async function scrapePolije() {
  const scraper = new WebScraper({
    urls: [
      'https://pintu.polije.ac.id/',
      'https://pintu.polije.ac.id/C_Halaman/page/7-layanan-usulan-pensiun-dini',
      'https://pintu.polije.ac.id/C_Halaman/page/9-layanan-usul-kartu-taspen',
      'https://pintu.polije.ac.id/C_Halaman/page/11-layanan-peminjaman-dan-penyewaan-bmn-gedung-serba-guna',
      'https://pintu.polije.ac.id/C_Halaman/page/13-layanan-peliputan-media',
      'https://pintu.polije.ac.id/C_Halaman/page/15-pelayanan-bidang-pengaduan-masyarakat',
      'https://pintu.polije.ac.id/C_Halaman/page/8-layanan-kartu-pegawai-hilang',
      'https://pintu.polije.ac.id/C_Halaman/page/10-layanan-usul-kartu-istri-suami',
      'https://pintu.polije.ac.id/C_Halaman/page/12-pelayanan-wisata-edukasi-dan-studi-banding',
      'https://pintu.polije.ac.id/C_Halaman/page/17-layanan-legalisir-ijasah-dan-transkrip-akademik',
      'https://pintu.polije.ac.id/C_Halaman/page/16-permohonan-data-dan-informasi',
      'https://pintu.polije.ac.id/C_Artikel/detail/14-memulai-aplikasi',
      'https://pintu.polije.ac.id/C_Artikel/detail/12-pendahuluan',
      'https://pintu.polije.ac.id/C_Artikel/detail/21-tentang-aplikasi-layanan-terpadu',

      'https://pmb.polije.ac.id/',

      'https://jti.polije.ac.id/',
      'https://jti.polije.ac.id/dosen',
      'https://jti.polije.ac.id/staf',
      'https://jti.polije.ac.id/profil-jti',
      'https://jti.polije.ac.id/tata-tertib-mahasiswa',
      'https://jti.polije.ac.id/galery/ruang-administrasi',
      'https://jti.polije.ac.id/prodi/trpl-sr',
      'https://jti.polije.ac.id/prodi/trk',
      'https://jti.polije.ac.id/prodi/tif',
      'https://jti.polije.ac.id/prodi/tif-bondowoso',
      'https://jti.polije.ac.id/prodi/tif-nganjuk',
      'https://jti.polije.ac.id/prodi/tif-sidoarjo',
      'https://jti.polije.ac.id/prodi/int-tif',
      'https://jti.polije.ac.id/prodi/mif',
      'https://jti.polije.ac.id/prodi/int-mif',
      'https://jti.polije.ac.id/prodi/tkk',
      'https://jti.polije.ac.id/prodi/int-tkk',
      'https://jti.polije.ac.id/prodi/bsd',

      'https://pp.polije.ac.id/',
      'https://pp.polije.ac.id/profil',
      'https://pp.polije.ac.id/ps-produksi-tanaman-hortikultura',
      'https://pp.polije.ac.id/ps-produksi-tanaman-perkebunan',
      'https://pp.polije.ac.id/ps-teknik-produksi-benih',
      'https://pp.polije.ac.id/ps-teknologi-produksi-tanaman-pangan',
      'https://pp.polije.ac.id/ps-budidaya-tanaman-perkebunan',
      'https://pp.polije.ac.id/ps-pengelolaan-perkebunan-kopi',
      'https://pp.polije.ac.id/laboratorium-tanaman',
      'https://pp.polije.ac.id/laboratorium-tanah',
      'https://pp.polije.ac.id/daftar-tenaga-pendidik-dosen',

      'https://tp.polije.ac.id/',
      'https://tp.polije.ac.id/tentang-kami',
      'https://tp.polije.ac.id/program-studi-keteknikan-pertanian',
      'https://tp.polije.ac.id/program-diploma-teknologi-industri-pangan',
      'https://tp.polije.ac.id/program-sarjana-terapan-teknologi-rekayasa-pangan',
      'https://tp.polije.ac.id/Dosen-TEP',
      'https://tp.polije.ac.id/dosen-tip',
      'https://tp.polije.ac.id/dosen-trp',
      'https://tp.polije.ac.id/administrasi',

      'https://peternakan.polije.ac.id/',
      'https://peternakan.polije.ac.id/profil-jurusan',
      'https://peternakan.polije.ac.id/prodi-produksi-ternak',
      'https://peternakan.polije.ac.id/prodi-produksi-ternak',
      'https://peternakan.polije.ac.id/prodi-teknologi-pakan-ternak',
      'https://peternakan.polije.ac.id/dosen-jpt',
      'https://peternakan.polije.ac.id/admin-dan-teknisi',

      'https://bkp.polije.ac.id/',
      'https://bkp.polije.ac.id/profil-bkp',
      'https://bkp.polije.ac.id/d4-promed',
      'https://bkp.polije.ac.id/despar',
      'https://bkp.polije.ac.id/d3-bahasa-inggris',
      'https://bkp.polije.ac.id/staff-bkp-1',

      'https://kesehatan.polije.ac.id/',
      'https://kesehatan.polije.ac.id/profil-jurusan-kesehatan',
      'https://kesehatan.polije.ac.id/manajemen-informasi-kesehatan',
      'https://kesehatan.polije.ac.id/struktur-organisasi-ps-mik',
      'https://kesehatan.polije.ac.id/gizi-klinik',
      'https://kesehatan.polije.ac.id/visi-misi-program-studi-promosi-kesehatan',
      'https://kesehatan.polije.ac.id/civitas-akademika-jurusan-kesehatan#dosen',
      'https://kesehatan.polije.ac.id/civitas-tendik-akademika-jurusan-kesehatan#teknisi',

      'https://teknik.polije.ac.id/',
      'https://teknik.polije.ac.id/jurusan-teknik',
      'https://teknik.polije.ac.id/halaman-dosen',
      'https://teknik.polije.ac.id/halaman-staff',
      'https://teknik.polije.ac.id/fasilitas',
      'https://teknik.polije.ac.id/hmj-teknik-periode-2024',
      'https://teknik.polije.ac.id/visi-misi-prodi-mesin-otomotif',
      'https://teknik.polije.ac.id/visi-misi-prodi-teknik-energi-terbarukan',
      'https://teknik.polije.ac.id/teknologi-rekayasa-mekatronika',
      'https://teknik.polije.ac.id/tata-tertib-mahasiswa',

      'https://bisnis.polije.ac.id/#1',
      'https://bisnis.polije.ac.id/jurusan-bisnis',
      'https://bisnis.polije.ac.id/sivitas-jurusan-bisnis',

      'https://polije.ac.id/',
      'https://polije.ac.id/sejarah/',
      'https://polije.ac.id/logo-4/',
      'https://polije.ac.id/visi-misi-polije/',
      'https://polije.ac.id/tujuan-sasaran-strategi/',
      'https://polije.ac.id/pimpinan-polije/',
      'https://polije.ac.id/dokumen-sakip/',
      'https://polije.ac.id/biaya-pendidikan-2/',
      'https://polije.ac.id/akreditasi/',
      'https://polije.ac.id/produksi-tanaman-hortikultura-2/',
      'https://polije.ac.id/produksi-tanaman-perkebunan-2/',
      'https://polije.ac.id/teknik-produksi-benih-2/',
      'https://polije.ac.id/teknologi-produksi-tanaman-pangan/',
      'https://polije.ac.id/budidaya-tanaman-perkebunan/',
      'https://polije.ac.id/pengelolaan-perkebunan-kopi/',
      'https://polije.ac.id/10737-2/',
      'https://polije.ac.id/teknologi-industri-pangan/',
      'https://polije.ac.id/teknologi-rekayasa-pangan/',
      'https://polije.ac.id/produksi-ternak/',
      'https://polije.ac.id/manajemen-bisnis-unggas/',
      'https://polije.ac.id/teknologi-pakan-ternak/',
      'https://polije.ac.id/manajemen-agribisnis/',
      'https://polije.ac.id/manajemen-agroindustri/',
      'https://polije.ac.id/manajemen-informatika/',
      'https://polije.ac.id/teknik-komputer/',
      'https://polije.ac.id/teknik-informatika/',
      'https://polije.ac.id/bisnis-digital-kampus-bondowoso/',
      'https://polije.ac.id/bahasa-inggris/',
      'https://polije.ac.id/destinasi-pariwisata/',
      'https://polije.ac.id/manajemen-informasi-kesehatan/',
      'https://polije.ac.id/gizi-klinik/',
      'https://polije.ac.id/promosi-kesehatan/',
      'https://polije.ac.id/teknik-energi-terbarukan/',
      'https://polije.ac.id/mesin-otomotif/',
      'https://polije.ac.id/teknologi-rekayasa-mekatronika/',
      'https://polije.ac.id/teknologi-rekayasa-mekatronika/',
      'https://polije.ac.id/manajemen-pemasaran-internasional/',
      'https://polije.ac.id/manajemen-informatika-int/',
      'https://polije.ac.id/teknik-informatika-int/',
      'https://polije.ac.id/manajamen-agroindustri-int/',
      'https://polije.ac.id/kampus-2-bondowoso/',
      'https://polije.ac.id/kampus-3-nganjuk/',
      'https://polije.ac.id/kampus-4-sidoarjo/',
      'https://polije.ac.id/kampus-5-ngawi/',
      'https://polije.ac.id/manajemen-perubahan/',
      'https://polije.ac.id/penataan-tata-laksana/',
      'https://polije.ac.id/penataan-sistem-manajemen-sdm/',
      'https://polije.ac.id/penguatan-akuntabilitas/',
      'https://polije.ac.id/penguatan-pengawasan/',
      'https://polije.ac.id/peningkatan-kualitas-pelayanan-publik/',

      'https://jtinova.com/',
      'https://www.side.my.id/',
      'https://www.linkedin.com/in/sideid',
    ],
    outputDir: './scraped_docs',
    maxDepth: 3,
    timeout: 60000,
    retries: 2,
    delayBetweenRequests: 2000,
  });

  try {
    const scrapedDocuments = await scraper.scrapeUrls();

    const processedDocuments = await scraper.processScrapedDocuments(
      scrapedDocuments,
    );

    const nonEmptyDocuments = processedDocuments.filter(
      (doc) => doc.pageContent && doc.pageContent.trim().length > 0,
    );

    console.log(`Scraped ${nonEmptyDocuments.length} non-empty documents`);
    return nonEmptyDocuments;
  } catch (error) {
    console.error('Failed to scrape Polije websites:', error);
    return [];
  }
}
