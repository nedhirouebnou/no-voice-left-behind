import { HRFlowProfile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Award,
} from "lucide-react";

interface ProfileOverviewProps {
  profile: HRFlowProfile;
}

export function ProfileOverview({ profile }: ProfileOverviewProps) {
  const { info, experiences, educations, skills, languages, certifications } =
    profile;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card-elevated p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {info?.full_name || "Nom inconnu"}
            </h2>
            {info?.summary && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {info.summary}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              {info?.email && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  {info.email}
                </span>
              )}
              {info?.phone && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  {info.phone}
                </span>
              )}
              {info?.location?.text && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {info.location.text}
                </span>
              )}
            </div>
            {info?.urls && info.urls.length > 0 && (
              <div className="flex gap-3 mt-3">
                {info.urls.map((url, i) => (
                  <a
                    key={i}
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    {url.type}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Compétences
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <Badge
                key={i}
                variant={skill.type === "hard" ? "default" : "secondary"}
              >
                {skill.name}
                {skill.value && (
                  <span className="ml-1 opacity-70">• {skill.value}</span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Experiences */}
      {experiences && experiences.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Expériences
            </h3>
          </div>
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div
                key={exp.key || i}
                className="relative pl-6 pb-4 border-l-2 border-border last:border-transparent last:pb-0"
              >
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />
                <h4 className="font-semibold text-foreground">{exp.title}</h4>
                <p className="text-sm text-primary font-medium">
                  {exp.company}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {exp.date_start} - {exp.date_end || "Présent"}
                  {exp.location?.text && ` • ${exp.location.text}`}
                </p>
                {exp.description && (
                  <p className="text-sm text-muted-foreground">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {educations && educations.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Formation</h3>
          </div>
          <div className="space-y-4">
            {educations.map((edu, i) => (
              <div key={edu.key || i}>
                <h4 className="font-semibold text-foreground">{edu.title}</h4>
                <p className="text-sm text-primary font-medium">{edu.school}</p>
                <p className="text-xs text-muted-foreground">
                  {edu.date_start} - {edu.date_end}
                  {edu.location?.text && ` • ${edu.location.text}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {languages && languages.length > 0 && (
          <div className="card-elevated p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Langues</h3>
            </div>
            <div className="space-y-2">
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-foreground">{lang.name}</span>
                  <Badge variant="secondary">{lang.value}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="card-elevated p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Certifications
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) => (
                <Badge key={i} variant="step">
                  {cert.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
