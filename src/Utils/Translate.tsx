import { Trans, useTranslation } from 'react-i18next'

export function Translate({ key }: { key: string }) {
    const { t } = useTranslation()
    return <Trans i18nKey={key}></Trans>
}