import ContactForm from "../../components/ContactForm/ContactForm";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import BranchCard from "../../components/BranchCard/BranchCard";
import SeoHead from "../../components/Seo/SeoHead";
import { BRANCHES_CATALOG } from "../../data/branchesCatalog";
import { getStaticSeo } from "../../seo/seoConfig";
import "./BranchesPage.css";

const PAGE_SEO = getStaticSeo("branches");

export default function BranchesPage() {
    return (
        <div className="branches-page">
            <SeoHead
                title={PAGE_SEO.title}
                description={PAGE_SEO.description}
                canonicalPath="/branches"
            />
            <main className="branches-page__main">
                <section className="branches-page__hero">
                    <div className="branches-page__container">
                        <Breadcrumbs
                            className="branches-page__crumbs"
                            ariaLabel="Breadcrumb"
                            items={[
                                { label: "Головна", to: "/" },
                                { label: "Філії" },
                            ]}
                        />

                        <h1>НАШІ ФІЛІЇ</h1>
                    </div>
                </section>

                <section className="branches-page__list">
                    <div className="branches-page__container">
                        <div className="branches-page__cards">
                            {BRANCHES_CATALOG.map((branch) => (
                                <BranchCard key={branch.id} branch={branch} />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="branches-page__contact">
                    <ContactForm
                        title="ВАША ДУМКА ВАЖЛИВА"
                        subtitle="ЗАЛИШТЕ СВІЙ ВІДГУК ЩОДО ЯКОСТІ НАШИХ ПОСЛУГ"
                        formType="Форма: Відгук"
                        placeholders={{
                            name: "Ваше імʼя",
                            phone: "Ваш номер телефону",
                            email: "Ваша ел. пошта (за бажанням)",
                            branch: "Оберіть філію",
                            diagnostic: "Вкажіть назву процедури",
                            checkupName: "Введіть назву CHECK-UP",
                            message: "Залиште свій відгук",
                        }}
                        fields={{
                            name: true,
                            phone: true,
                            email: true,
                            branch: false,
                            diagnostic: false,
                            checkupName: false,
                            message: true,
                        }}
                    />
                </section>
            </main>
        </div>
    );
}
