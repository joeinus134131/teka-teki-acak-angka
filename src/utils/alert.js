import Swal from 'sweetalert2';

const CyberAlert = Swal.mixin({
  background: 'var(--panel)',
  color: 'var(--text)',
  confirmButtonColor: 'var(--accent)',
  cancelButtonColor: 'var(--accent3)',
  customClass: {
    popup: 'glass-panel',
    title: 'alert-title',
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-outline'
  },
  buttonsStyling: false
});

export const notify = {
  success: (title, text) => CyberAlert.fire({ icon: 'success', title, text, iconColor: 'var(--accent2)' }),
  error: (title, text) => CyberAlert.fire({ icon: 'error', title, text, iconColor: 'var(--accent3)' }),
  info: (title, text) => CyberAlert.fire({ icon: 'info', title, text, iconColor: 'var(--accent)' }),
  confirm: (title, text) => CyberAlert.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'YA',
    cancelButtonText: 'BATAL',
    iconColor: 'var(--accent)'
  })
};
