import { useTranslation } from "react-i18next"

export const useColumn = () => {
  const { t } = useTranslation('column');

  return { t };
}
