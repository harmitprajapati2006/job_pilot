import Image from "next/image";

export function Testimonial() {
  return (
    <section className="py-20 md:py-28 bg-surface-secondary/40 border-y border-border">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 text-center">
        <span className="text-xs font-semibold tracking-wider text-accent uppercase">
          Success Stories
        </span>

        <blockquote className="mt-6 max-w-3xl mx-auto text-xl sm:text-2xl lg:text-[28px] font-medium text-text-primary leading-snug">
          &ldquo;I used to spend my evenings copy-pasting resumes. Now I open my
          dashboard to see interviews waiting. It feels like cheating. Had 3
          offers on the table simultaneously.&rdquo;
        </blockquote>

        <div className="mt-8 flex items-center justify-center gap-3.5">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-border flex-shrink-0">
            <Image
              src="/images/tom-wilson.jpg"
              alt="Tom Wilson"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-text-primary">
              Tom Wilson
            </div>
            <div className="text-xs text-text-secondary">
              Junior Developer
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
