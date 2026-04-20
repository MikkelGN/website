import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import NavBar from '../components/NavBar'
import { convertToLinkedIn } from '../api/client'
import styles from './LinkedInPage.module.css'

const EXAMPLES_DA = ['Spiste havregrød til morgenmad', 'Glemte min paraply', 'Tabte min sandwich', 'Tog bussen']
const EXAMPLES_EN = ['Ate cereal for breakfast', 'Forgot my umbrella', 'Dropped my sandwich', 'Took the bus']

export default function LinkedInPage() {
  const { t, i18n } = useTranslation()
  const [input, setInput] = useState('')
  const [post, setPost] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const examples = i18n.language === 'da' ? EXAMPLES_DA : EXAMPLES_EN

  const generate = async (text = input) => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setPost('')
    try {
      const res = await convertToLinkedIn(text.trim(), i18n.language)
      setPost(res.data.post)
    } catch (e: any) {
      setError(e?.response?.data?.error ?? t('linkedin.error'))
    } finally {
      setLoading(false)
    }
  }

  const useExample = (ex: string) => {
    setInput(ex)
    generate(ex)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(post)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="page">
      <NavBar />
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{t('linkedin.title')}</h2>
          <p className={styles.subtitle}>{t('linkedin.subtitle')}</p>
        </div>

        <div className={styles.layout}>
          {/* ── Input side ── */}
          <div className={styles.inputSide}>
            <label className={styles.label}>{t('linkedin.inputLabel')}</label>
            <textarea
              ref={textareaRef}
              className={styles.textarea}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) generate() }}
              placeholder={t('linkedin.placeholder')}
              rows={4}
              maxLength={300}
            />
            <div className={styles.charCount}>{input.length}/300</div>

            <button
              className={`btn btn-primary ${styles.generateBtn}`}
              onClick={() => generate()}
              disabled={loading || !input.trim()}
            >
              {loading ? t('linkedin.generating') : `🚀 ${t('linkedin.generate')}`}
            </button>

            <div className={styles.examples}>
              <span className={styles.examplesLabel}>{t('linkedin.examples')}:</span>
              {examples.map(ex => (
                <button
                  key={ex}
                  className={styles.exampleChip}
                  onClick={() => useExample(ex)}
                  disabled={loading}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {/* ── Output side ── */}
          <div className={styles.outputSide}>
            {!post && !loading && !error && (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>💼</span>
                <p>{t('linkedin.emptyState')}</p>
              </div>
            )}

            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingDots}>
                  <span /><span /><span />
                </div>
                <p className={styles.loadingText}>{t('linkedin.thinking')}</p>
              </div>
            )}

            {error && (
              <div className={styles.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}

            {post && !loading && (
              <div className={styles.postCard}>
                <div className={styles.postHeader}>
                  <div className={styles.avatar}>M</div>
                  <div>
                    <div className={styles.posterName}>Migini Games User</div>
                    <div className={styles.posterMeta}>{t('linkedin.posterMeta')}</div>
                  </div>
                </div>
                <div className={styles.postBody}>
                  {post.split('\n').map((line, i) => (
                    <p key={i} className={line.trim() === '' ? styles.spacer : styles.postLine}>
                      {line}
                    </p>
                  ))}
                </div>
                <div className={styles.postFooter}>
                  <button className={styles.copyBtn} onClick={copy}>
                    {copied ? `✓ ${t('linkedin.copied')}` : `📋 ${t('linkedin.copy')}`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
