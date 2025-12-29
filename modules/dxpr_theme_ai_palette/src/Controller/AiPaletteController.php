<?php

namespace Drupal\dxpr_theme_ai_palette\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for AI palette generation.
 */
class AiPaletteController extends ControllerBase {

  /**
   * The AI provider manager.
   *
   * @var \Drupal\ai\AiProviderPluginManager|null
   */
  protected $aiProviderManager;

  /**
   * The system prompt for palette generation.
   *
   * @var string
   */
  protected const SYSTEM_PROMPT = <<<'PROMPT'
You are a professional color palette designer. Generate a cohesive, visually appealing color palette based on the user's request.

Return ONLY valid JSON with these exact keys and hex color values (no markdown, no explanation):
{
  "base": "#XXXXXX",
  "basetext": "#XXXXXX",
  "link": "#XXXXXX",
  "accent1": "#XXXXXX",
  "accent1text": "#XXXXXX",
  "accent2": "#XXXXXX",
  "accent2text": "#XXXXXX",
  "text": "#XXXXXX",
  "headings": "#XXXXXX",
  "card": "#XXXXXX",
  "cardtext": "#XXXXXX",
  "footer": "#XXXXXX",
  "footertext": "#XXXXXX",
  "secheader": "#XXXXXX",
  "secheadertext": "#XXXXXX",
  "header": "#XXXXXX",
  "headertext": "#XXXXXX",
  "headerside": "#XXXXXX",
  "headersidetext": "#XXXXXX",
  "pagetitle": "#XXXXXX",
  "pagetitletext": "#XXXXXX",
  "graylight": "#XXXXXX",
  "graylighter": "#XXXXXX",
  "silver": "#XXXXXX",
  "body": "#XXXXXX"
}

Color explanations:
- base: Primary brand color
- basetext: Text on primary color (ensure WCAG AA contrast)
- link: Link color
- accent1/accent2: Secondary/tertiary accent colors
- accent1text/accent2text: Text on accent colors
- text: Body text color
- headings: Heading text color
- card/cardtext: Card background and text
- footer/footertext: Footer background and text
- secheader/secheadertext: Secondary header background and text
- header/headertext: Main header background and text
- headerside/headersidetext: Mobile menu background and text
- pagetitle/pagetitletext: Page title section background and text
- graylight/graylighter: Light gray utility colors
- silver: Very light background color
- body: Main page background color

Requirements:
- Use 6-digit hex codes only (e.g., #1A2B3C)
- Ensure proper contrast between text and background pairs (WCAG AA minimum)
- Create a harmonious, professional color scheme
- The body background should typically be white or very light for light themes, or very dark for dark themes
PROMPT;

  /**
   * Required color keys.
   *
   * @var array
   */
  protected const REQUIRED_KEYS = [
    'base', 'basetext', 'link', 'accent1', 'accent1text', 'accent2',
    'accent2text', 'text', 'headings', 'card', 'cardtext', 'footer',
    'footertext', 'secheader', 'secheadertext', 'header', 'headertext',
    'headerside', 'headersidetext', 'pagetitle', 'pagetitletext',
    'graylight', 'graylighter', 'silver', 'body',
  ];

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $instance = parent::create($container);
    // Only inject AI provider if the AI module is installed.
    if ($container->has('ai.provider')) {
      $instance->aiProviderManager = $container->get('ai.provider');
    }
    return $instance;
  }

  /**
   * Generate a color palette using AI.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   The request object.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   JSON response with colors or error.
   */
  public function generate(Request $request): JsonResponse {
    // Check if AI module is installed.
    if (!$this->aiProviderManager) {
      return new JsonResponse([
        'error' => $this->t('The AI module is not installed. Please install and configure the AI module to use this feature.'),
      ], 503);
    }

    $prompt = $request->request->get('prompt');

    if (empty($prompt)) {
      return new JsonResponse([
        'error' => $this->t('Please enter a prompt describing your desired color palette.'),
      ], 400);
    }

    // Get the default chat provider.
    try {
      $default = $this->aiProviderManager->getDefaultProviderForOperationType('chat');
      if (!$default) {
        return new JsonResponse([
          'error' => $this->t('No AI provider configured. Please configure an AI provider in the AI module settings.'),
        ], 500);
      }

      $provider = $this->aiProviderManager->createInstance($default['provider_id']);

      $input = new \Drupal\ai\OperationType\Chat\ChatInput([
        new \Drupal\ai\OperationType\Chat\ChatMessage('user', $prompt),
      ]);
      $input->setSystemPrompt(self::SYSTEM_PROMPT);

      $response = $provider->chat($input, $default['model_id'], ['dxpr-palette']);
      $responseText = $response->getNormalized()->getText();

      // Extract JSON from response (handle potential markdown code blocks).
      $jsonText = $this->extractJson($responseText);
      $colors = json_decode($jsonText, TRUE);

      if (json_last_error() !== JSON_ERROR_NONE) {
        return new JsonResponse([
          'error' => $this->t('Failed to parse AI response. Please try again.'),
          'debug' => $responseText,
        ], 500);
      }

      // Validate all required color keys are present.
      $missingKeys = array_diff(self::REQUIRED_KEYS, array_keys($colors));
      if (!empty($missingKeys)) {
        return new JsonResponse([
          'error' => $this->t('AI response missing required colors: @keys', [
            '@keys' => implode(', ', $missingKeys),
          ]),
        ], 500);
      }

      // Validate all colors are valid hex codes.
      foreach ($colors as $key => $color) {
        if (!preg_match('/^#[0-9A-Fa-f]{6}$/', $color)) {
          return new JsonResponse([
            'error' => $this->t('Invalid color format for @key: @color', [
              '@key' => $key,
              '@color' => $color,
            ]),
          ], 400);
        }
      }

      return new JsonResponse(['colors' => $colors]);
    }
    catch (\Exception $e) {
      return new JsonResponse([
        'error' => $this->t('AI request failed: @message', [
          '@message' => $e->getMessage(),
        ]),
      ], 500);
    }
  }

  /**
   * Extract JSON from response that might be wrapped in markdown code blocks.
   *
   * @param string $text
   *   The response text.
   *
   * @return string
   *   The extracted JSON string.
   */
  protected function extractJson(string $text): string {
    // Try to extract JSON from markdown code blocks.
    if (preg_match('/```(?:json)?\s*(\{[\s\S]*?\})\s*```/', $text, $matches)) {
      return $matches[1];
    }

    // Try to find a JSON object directly.
    if (preg_match('/\{[\s\S]*\}/', $text, $matches)) {
      return $matches[0];
    }

    return $text;
  }

}
