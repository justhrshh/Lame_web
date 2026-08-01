import React, { useState } from 'react';
import styles from './Contact.module.css';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [selectedServices, setSelectedServices] = useState(['Website Development']);
  const [selectedBudget, setSelectedBudget] = useState('$5k – $10k');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const servicesList = [
    'Website Development',
    'Landing Pages',
    'UI/UX Design',
    'Dashboard & SaaS',
    'Custom Web Apps',
    '60FPS Optimization'
  ];

  const budgetRanges = [
    '$3k – $5k',
    '$5k – $10k',
    '$10k – $20k',
    '$20k+'
  ];

  const toggleService = (srv) => {
    if (selectedServices.includes(srv)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== srv));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setIsSubmitting(true);

    // Web3Forms Direct Email Integration
    const formEndpoint = "https://api.web3forms.com/submit";
    const accessKey = "74fa7704-0af4-42e3-bcb3-5856353d1c02"; 

    try {
      await fetch(formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          services: selectedServices.join(', '),
          budget: selectedBudget,
          subject: `New Project Proposal from ${formData.name}`
        })
      });
    } catch (err) {
      console.log("Form submission response:", err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 6000);
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className="caption-label">06 // INITIATE COLLABORATION</span>
          <h2 className="heading-section">
            Let's Architect Something <br />
            <span className="serif-italic text-gradient">Extraordinary Together.</span>
          </h2>
          <p className="subheading">
            Directly estimate your project scope, choose your desired budget range, and send us your requirements. We respond within 24 hours.
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Left Column: Direct Studio Meta */}
          <div className={styles.studioInfoCol}>
            <div className={styles.infoBox}>
              <span className={styles.boxLabel}>DIRECT EMAIL</span>
              <a href="mailto:hello@lamedev.io" className={styles.boxValueLink}>hello@lamedev.io</a>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.boxLabel}>ESTIMATED START</span>
              <span className={styles.boxValue}>Available for Q3 / Q4 Projects</span>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.boxLabel}>GLOBAL TIMEZONE</span>
              <span className={styles.boxValue}>UTC / EST / PST Flexible</span>
            </div>

            <div className={styles.infoBox}>
              <span className={styles.boxLabel}>SLOTS REMAINING</span>
              <div className={styles.slotBadge}>
                <span className={styles.slotDot} />
                <span>2 Active Project Slots Open</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Estimator Form */}
          <div className={styles.formContainer}>
            {isSubmitted ? (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h3 className={styles.successTitle}>Project Request Received!</h3>
                <p className={styles.successDesc}>
                  Thank you, <strong style={{ color: '#FFF' }}>{formData.name}</strong>. We have logged your request for <strong style={{ color: '#FFF' }}>{selectedServices.join(', ')}</strong> ({selectedBudget}).
                  Our team will review your proposal and get in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.estimatorForm}>
                {/* Step 1: Select Services */}
                <div className={styles.formGroup}>
                  <label className={styles.groupLabel}>1. SELECT NEEDED SERVICES</label>
                  <div className={styles.chipsRow}>
                    {servicesList.map((srv) => (
                      <button
                        type="button"
                        key={srv}
                        className={`${styles.chipBtn} ${selectedServices.includes(srv) ? styles.chipActive : ''}`}
                        onClick={() => toggleService(srv)}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Select Budget */}
                <div className={styles.formGroup}>
                  <label className={styles.groupLabel}>2. PROJECT BUDGET RANGE</label>
                  <div className={styles.budgetRow}>
                    {budgetRanges.map((b) => (
                      <button
                        type="button"
                        key={b}
                        className={`${styles.budgetBtn} ${selectedBudget === b ? styles.budgetActive : ''}`}
                        onClick={() => setSelectedBudget(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Contact Inputs */}
                <div className={styles.formInputsGrid}>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      className={styles.inputField}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.inputWrapper}>
                    <input
                      type="email"
                      required
                      placeholder="Your Email *"
                      className={styles.inputField}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.inputWrapper}>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your project vision, timeline, or reference links..."
                    className={styles.textareaField}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  <span>{isSubmitting ? 'SENDING REQUEST...' : 'SEND PROJECT PROPOSAL'}</span>
                  <span className={styles.btnArrow}>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
